import { gql, InMemoryCache } from 'apollo-boost'
import _ from 'lodash'

const SQUID_SITE_URL = process.env.SQUID_SITE_URL || 'https://squid.id'
const SQUID_API_URL = process.env.SQUID_API_URL || 'https://api.squid.id'

export { SQUID_SITE_URL, SQUID_API_URL }

const LIST_APPLICATION = gql`
  query {
    applications @client {
      id
      userKey
      permissions
      deleted
    }
  }
`

export const getHeaders = (cache: InMemoryCache, permissions: Permission[]): { [key: name]: string } => {
  let applications = cache.readQuery<{ applications: Application[] }>({
    query: LIST_APPLICATION,
  })!.applications
  /* 
    filter application by permissions
  */
  applications = applications.filter(application => {
    if (application.deleted) {
      return false
    }
    if (!application.permissions) {
      return false
    }
    return permissions.some(permission => {
      return application.permissions.includes(permission)
    })
  })

  const headers = {
    // 'X-ThaiAlert-User-Public-Key': '345',
    'Content-Type': 'application/json',
    'X-ThaiAlert-Apps': applications.map(app => {
      return app.id + '.' + app.userKey
    }).join(','),
  }
  console.log('headers', headers)
  return headers
}

export const getDataToken = async (application: Application) => {
  const headers = {
    'X-ThaiAlert-Apps': application.id + '.' + application.userKey,
  }
  const resp = await fetch(`${SQUID_API_URL}/userdata`, {
    headers,
  })
  const data = await resp.json()
  return data?.qr?.[0]?.dataToken
}
