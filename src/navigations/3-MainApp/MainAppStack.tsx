import React from 'react'
import { MainApp } from './MainApp'
import { QRCodeScan } from './QRCodeScan'
import { QRCodeResult } from './QRCodeResult'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { createBottomTabNavigator } from 'react-navigation'
import { COLORS, FONT_FAMILY } from '../../styles'
import { Text } from 'react-native'

export const MainAppTab = createBottomTabNavigator({
  MainApp: {
    screen: MainApp,
    navigationOptions: {
      tabBarLabel: ({ focused }) => (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontFamily: FONT_FAMILY,
            marginBottom: 2,
            color: focused ? COLORS.PRIMARY_DARK : COLORS.GRAY_2,
          }}
        >
          ข้อมูล
        </Text>
      ),
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
      tabBarLabel: ({ focused }) => (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontFamily: FONT_FAMILY,
            marginBottom: 2,
            color: focused ? COLORS.PRIMARY_DARK : COLORS.GRAY_2,
          }}
        >
          สแกน QR
        </Text>
      ),
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
