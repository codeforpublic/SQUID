import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { MainApp } from './MainApp'


export const MainAppStack = createStackNavigator(
  {
    MainApp,
    QRCodeScan: () => <MockScreen title="แสกน QR" />,
    QRCodeResult: () => <MockScreen title="QR Result" />,
  },
  {
    headerMode: "none"
  }
)
