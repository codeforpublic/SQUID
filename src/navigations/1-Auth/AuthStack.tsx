import { createStackNavigator } from 'react-navigation'
import { AuthPhone } from './AuthPhone'
import { AuthOTP } from './AuthOTP'
/*
  handle deeplink
  morchana://app/:appId
*/
export const AuthStack = createStackNavigator(
  {
    AuthPhone,
    AuthOTP,
  },
  {
    headerMode: 'none',
    mode: 'modal'
  },
)
