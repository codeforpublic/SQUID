import { YourLinkPage } from './YourLinkPage'
import { CreateLinkPage } from './CreateLinkPage'
import { ApplicationList } from './ApplicationList'
import { createStackNavigator } from 'react-navigation'
import { ApplicationInfo } from './ApplicationInfo'
import { ApplicationDebugScreen } from './ApplicationDebugScreen'

export const ApplicationStack = createStackNavigator(
  {
    ApplicationList: {
      screen: ApplicationList,
    },
    ApplicationInfo: {
      screen: ApplicationInfo,
    },
    CreateLink: {
      screen: CreateLinkPage,
    },
    YourLink: {
      screen: YourLinkPage,
    },
    ApplicationDebug: {
      screen: ApplicationDebugScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'ApplicationList',
  },
)
