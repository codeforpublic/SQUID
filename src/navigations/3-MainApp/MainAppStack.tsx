import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MainApp } from './MainApp'
import { QRCodeScan } from './QRCodeScan'
import { QRCodeResult } from './QRCodeResult'


export const MainAppStack = createStackNavigator(
  {
    MainApp,
    QRCodeScan,
  },
  {
    headerMode: "none"
  }
)
