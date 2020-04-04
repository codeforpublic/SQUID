import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { Home } from './Home'
import { AgreementPolicy } from './AgreementPolicy'
import { AuthPhone } from './AuthPhone'
import { AuthOTP } from './AuthOTP'
/*
  handle deeplink
  morchana://app/:appId
*/
export const AuthStack = createStackNavigator(
  {
    Home,
    AgreementPolicy,
    AuthPhone,
    AuthOTP,
  },
  {
    headerMode: 'none',
  },
)
