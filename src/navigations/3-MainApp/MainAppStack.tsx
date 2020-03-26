import React from 'react'
import { MainApp } from './MainApp'
import { QRCodeScan } from './QRCodeScan'
import { QRCodeResult } from './QRCodeResult'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { createBottomTabNavigator } from 'react-navigation'
import { COLORS } from '../../styles'

export const MainAppTab = createBottomTabNavigator({
  MainApp: {
    screen: MainApp,
    navigationOptions: {
      label: 'ข้อมูล',
      tabBarIcon: ({ focused }) => (
        <Icon
          name="user"
          color={focused ? COLORS.PRIMARY_DARK : COLORS.GRAY_2}
          size={20}
        />
      ),
    },
  },
  QRCodeScan: {
    screen: QRCodeScan,
    navigationOptions: {
      label: 'สแกน QR',
      tabBarIcon: ({ focused }) => (
        <AntIcon
          name="scan1"
          color={focused ? COLORS.PRIMARY_DARK : COLORS.GRAY_2}
          size={20}
        />
      ),
    },
  },
})
