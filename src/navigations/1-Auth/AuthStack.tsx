import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'

/*
  handle deeplink
  fightcovid19://app/:appId
*/
export const AuthStack = createStackNavigator(
  {
    Home: () => <MockScreen title="หยุดเชื้อ เพื่อชาติ" nextScreen="AgreementPolicy" />,
    AgreementPolicy: () => <MockScreen title="ข้อตกลงและเงื่อนไข" nextScreen="AuthPhone" />,
    AuthPhone: () => <MockScreen title="กรอกเบอร์โทรศัพท์" nextScreen="AuthOTP" />,
    AuthOTP: () => <MockScreen title="กรอกรหัสจาก SMS" nextScreen="Onboarding" />,
  },
  {
    headerMode: "none"
  }
)
