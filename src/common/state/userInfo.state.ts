import { gql, InMemoryCache } from 'apollo-boost'
import { SQUID_API_URL, getHeaders } from '../api'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

export const apolloState = {
  initialState: {
    userInfo: {
      __typename: 'UserInfo',
      id: 1,
      data: JSON.stringify({}),
    },
  },
  Mutation: {
    syncUserData: async (
      _,
      { data, campaignId }: { data: UserData; campaignId?: string },
      { cache }: { cache: InMemoryCache },
    ) => {
      const { userInfo } = cache.readQuery({
        query: UserInfoQuery,
      })
      cache.writeData({
        data: {
          userInfo: {
            ...userInfo,
            data: JSON.stringify({ ...JSON.parse(userInfo.data), ...data }),
          },
        },
      })
      console.log('--syncUserData---')
      
      const resp = await fetch(`${SQUID_API_URL}/userdata`, {
        method: "post",
        headers: getHeaders(cache, ['data:*']),
        body: JSON.stringify({ userdata: UserInfoUtils.formatUserData(data) })
      })
      
      console.log('--syncUserData---', resp.status)
    },
  },
}

export const UserInfoQuery = gql`
  query {
    userInfo @client {
      id
      data
      __typename
    }
  }
`

export const useUserInfo = () => {
  const { data, loading, error } = useQuery<{ userInfo: UserInfo }>(
    UserInfoQuery,
  )
  let userInfo
  if (data?.userInfo) {
    userInfo = { ...data.userInfo, data: JSON.parse(data.userInfo.data) }
  }
  return [userInfo, loading, error]
}

export const UserInfoMutation = {
  syncUserData: gql`
    mutation syncUserData($data: UserInfo!, $campaignId: string) {
      syncUserData(data: $data, campaignId: $campaignId) @client
    }
  `,
}

export const UserInfoUtils = {
  formatUserData: (userData: {[name: string]: any}) => {
    return {
      ..._.mapValues(userData, d => {
        if (d === 'true') {
          return true
        } else if (d === 'false') {
          return false
        }
        return d
      }),
      version: '1',
    }
  },
}
