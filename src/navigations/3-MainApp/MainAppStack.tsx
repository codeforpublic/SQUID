import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'

/*
  handle deeplink
  fightcovid19://app/:appId
*/
export const MainAppStack = createStackNavigator(
  {
    MainApp: () => <MockScreen title="หยุดเชื้อ เพื่อชาติ" />,
    QRCodeScan: () => <MockScreen title="แสกน QR" />,
  },
  {
    headerMode: "none"
  }
)
