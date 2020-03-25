interface UserData {
  [name: string]: any
}

interface UserInfo {
  id: string
  data: string
  __typename: string
}

type Permission = 'location:basic' | 'location:real_time' | 'data:*' | 'data:id' | 'data:covid' | 'data:community' | 'data:travel'
interface Application {
  __typename?: string
  id: string
  type: "campaign" | "link"
  version: string
  displayName: string
  logo?: string
  description: string
  permissions: Permission[]
  allowPermissions?: Permission[]
  deleted?: Boolean
  url: {
    __typename?: string
    privacy_policy: string
    tos: string
    hook_location: string
    hook_data: string
  }
  userKey?: string
}

interface Campaign {
  version: string
  id: string
  displayName: string
  logo: string
  description: string
  permissions: [string],
  url: {
    privacy_policy: string
    tos: string
    "hook:location": string
    "hook:data": string
  }
}