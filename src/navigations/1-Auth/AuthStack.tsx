import { createStackNavigator } from 'react-navigation'
import { AuthPhone } from './AuthPhone'
import { AuthOTP } from './AuthOTP'
import { OnboardPhone } from './OnboardPhone'
/*
  handle deeplink
  morchana://app/:appId
*/
export const AuthStack = createStackNavigator(
  {
    OnboardPhone,
    AuthPhone,
    AuthOTP,
  },
  {
    headerMode: 'none',
    mode: 'modal'
  },
)
