import { createStackNavigator } from 'react-navigation'
import { AppForm } from './AppForm'
import { AppFormMoreInfo } from './AppFormMoreInfo'

/*
  handle deeplink
  fightcovid19://app/:appId
*/
export const AppFormStack = createStackNavigator(
  {
    AppForm: {
      screen: AppForm,
      path: 'app/:applicationId'
    }, // load, create, save
    AppFormMoreInfo // more info, save more info
  },
  {
    headerMode: "none",
    initialRouteName: 'AppForm'
  }
)
