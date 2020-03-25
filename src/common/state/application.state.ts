import { gql, InMemoryCache, ApolloError, ApolloClient } from 'apollo-boost'
import { SQUID_API_URL, SQUID_SITE_URL, getDataToken } from '../api'
import { useQuery } from '@apollo/react-hooks'
import useFetch from 'react-fetch-hook'
import nanoid from 'nanoid'
import { useEffect, useState } from 'react'
interface CacheParams {
  cache: InMemoryCache
}

const ApplicationFragment = `
  id
  type
  version
  displayName
  logo
  description
  permissions
  allowPermissions
  userKey
  deleted
  url {
    __typename
    privacy_policy
    tos
    hook_location
    hook_data
  }
`

const generateUserKey = () => nanoid()

const ensureStructure = (application: Application): Application => {
  const fields = ApplicationFragment.replace(/\n|/g, '')
    .split(' ')
    .filter(Boolean)
  fields.forEach(field => {
    if (typeof application[field] === 'undefined') {
      application[field] = null
    }
  })
  if (!application.allowPermissions) {
    application.allowPermissions = []
  }
  if (!application.permissions) {
    application.permissions = []
  }
  if (!application.deleted) {
    application.deleted = false
  }
  if (application.url) {
    application.url = { ...application.url, __typename: 'ApplicationURL' }
  }
  if (!application.userKey) {
    application.userKey = generateUserKey()
  }
  application.__typename = 'Application'
  return application
}

const migrateStructure = (applications: Application[]) => {
  for (let i = 0; i < applications.length; i++) {
    applications[i] = ensureStructure(applications[i])
  }
  return applications
}

export const apolloState = {
  async migrate(client: ApolloClient<InMemoryCache>) {    
    return new Promise((resolve, reject) => {
      const sub = client.watchQuery<{
        applications: Application[]
      }>({
        query: ListApplicationQuery,
        returnPartialData: true // returnPartialData not work on client.query
      }).subscribe(({ data: { applications }, loading, errors }) => {
        if (errors) {
          reject(errors)
        }
        if (loading) {
          return
        }
        client.writeData({
          data: {
            applications: migrateStructure(applications),
          },
        })
        sub.unsubscribe()
        resolve()
      })
    })
  },
  initialState: {
    applications: [],
  },
  Query: {
    application: (_, { applicationId }, { cache }: CacheParams) => {
      const applications = cache.readQuery<{ applications: [Application] }>({
        query: ListApplicationQuery,
      })!.applications
      return applications.find(c => c.id === applicationId)
    },
  },
  Mutation: {
    deleteApplication: async (_, { applicationId }, { cache }: CacheParams) => {
      const application = cache.readQuery<{ application: Application }>({
        query: GetApplicationQuery,
        variables: {
          applicationId,
        },
      })!.application

      cache.writeQuery({
        query: GetApplicationQuery,
        variables: {
          applicationId,
        },
        data: {
          application: {
            ...application,
            deleted: true,
          },
        },
      })

      return null
    },
    saveApplication: async (
      _,
      { application }: { application: Application },
      { cache }: CacheParams,
    ) => {
      try {
        const applications = cache.readQuery<{ applications: [Application] }>({
          query: ListApplicationQuery,
        })!.applications

        const index = applications.findIndex(c => c.id === application.id)
        console.log('index = ', index)

        if (index >= 0) {
          /* override data before ensureStructure */
          application = ensureStructure({
            ...applications[index],
            ...application,
          })
          cache.writeQuery({
            query: GetApplicationQuery,
            variables: {
              applicationId: application.id,
            },
            data: {
              application: application,
            },
          })
          const buffer = [...applications.map(ensureStructure)]
          buffer[index] = application
          cache.writeData({
            data: {
              applications: buffer,
            },
          })
        } else {
          application = ensureStructure(application)
          cache.writeQuery({
            query: GetApplicationQuery,
            variables: {
              applicationId: application.id,
            },
            data: {
              application: application,
            },
          })
          cache.writeData({
            data: {
              applications: applications.map(ensureStructure).concat(application),
            },
          })
        }        
        return null
      } catch (err) {
        console.error(err)
      }
    },
  },
}

export const GetApplicationQuery = gql`
  query application($applicationId: String!){
    application(applicationId: $applicationId) @client {
      ${ApplicationFragment}
    }
  }
`

export const ListApplicationQuery = gql`
  query {
    applications @client {
      ${ApplicationFragment}
    }
  }
`
export const useApplicationList = (): [
  Application[] | undefined,
  boolean,
  ApolloError | undefined,
] => {
  const { data, loading, error } = useQuery<{ applications: Application[] }>(
    ListApplicationQuery,
  )  
  return [data?.applications.filter(app => !app.deleted), loading, error]
}

export const ApplicationMutation = {
  deleteApplication: gql`
    mutation deleteApplication($applicationId: string!) {
      deleteApplication(applicationId: $applicationId) @client
    }
  `,
  saveApplication: gql`
    mutation saveApplication($application: Application!) {
      saveApplication(application: $application) @client
    }
  `,
}

export const ApplicationUtils = {
  getLink: (application: Application): string => {
    return `${SQUID_SITE_URL}/l/${application.id.replace('link:', '')}`
  },
  getQRCode: async (application: Application): Promise<string | null> => {
    const dataToken = await getDataToken(application)
    if (!dataToken) {
      return null
    }
    const url = `${SQUID_API_URL}/qr/${dataToken}`
    return url
  },
}
export const useFetchApplication = (
  campaignId: string,
): [Campaign | undefined, boolean, any] => {
  const { isLoading, data, error } = useFetch<Campaign>(
    `${SQUID_API_URL}/application/${campaignId}`,
  )
  return [data, isLoading, error]
}

export const useApplication = (
  applicationId: string,
): [Application | undefined, boolean, ApolloError | undefined] => {
  const { data, loading, error } = useQuery<{ application: Application }>(
    GetApplicationQuery,
    {
      variables: {
        applicationId,
      },
    },
  )
  return [data?.application, loading, error]
}

type QRCacheType = {
  [name: string]: {
    url: string
    timestamp: number
  } | null
}
let qrCaches: QRCacheType = {}

const QR_TIMEOUT = 2 * 60 * 1000
export const useQRCode = (application: Application): string | null => {
  let initValue = null
  let cache = qrCaches[application.id]
  if (cache) {
    initValue = Date.now() - cache.timestamp < QR_TIMEOUT ? cache.url : null
  }
  const [qrURL, setQRURL] = useState<string | null>(initValue)

  useEffect(() => {
    if (!application) {
      return
    }
    const s = () => {
      ApplicationUtils.getQRCode(application).then(url => {
        if (url) {
          qrCaches[application.id] = {
            url,
            timestamp: Date.now(),
          }
        }
        setQRURL(url)
      })
    }
    s()
    let it = setInterval(() => {
      s()
    }, QR_TIMEOUT / 2)
    return () => {
      clearInterval(it)
    }
  }, [application])
  return qrURL
}
