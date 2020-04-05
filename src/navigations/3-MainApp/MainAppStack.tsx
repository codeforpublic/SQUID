import React from 'react'
import { MainApp } from './MainApp'
import { QRCodeScan } from './QRCodeScan'
import { Settings } from './Settings'
import { Debug } from './Debug'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation'
import { COLORS, FONT_FAMILY } from '../../styles'
import { Text } from 'react-native'
import { MainAppFaceCamera } from './MainAppFaceCamera'

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
            color: focused ? '#303342' : COLORS.GRAY_2,
          }}
        >
          ข้อมูล
        </Text>
      ),
      tabBarIcon: ({ focused }) => (
        <Icon
          name="user"
          color={focused ? '#303342' : COLORS.GRAY_2}
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
            color: focused ? '#303342' : COLORS.GRAY_2,
          }}
        >
          สแกน QR
        </Text>
      ),
      tabBarIcon: ({ focused }) => (
        <AntIcon
          name="scan1"
          color={focused ? '#303342' : COLORS.GRAY_2}
          size={20}
        />
      ),
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      tabBarLabel: ({ focused }) => (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontFamily: FONT_FAMILY,
            marginBottom: 2,
            color: focused ? '#303342' : COLORS.GRAY_2,
          }}
        >
          ตั้งค่า
        </Text>
      ),
      tabBarIcon: ({ focused }) => (
        <AntIcon
          name="profile"
          color={focused ? '#303342' : COLORS.GRAY_2}
          size={20}
        />
      ),
    },
  },
  // Debug: {
  //   screen: Debug,
  //   navigationOptions: {
  //     tabBarLabel: ({ focused }) => (
  //       <Text
  //         style={{
  //           textAlign: 'center',
  //           fontSize: 12,
  //           fontFamily: FONT_FAMILY,
  //           marginBottom: 2,
  //           color: focused ? '#303342' : COLORS.GRAY_2,
  //         }}
  //       >
  //         Debug
  //       </Text>
  //     ),
  //     tabBarIcon: ({ focused }) => (
  //       <AntIcon
  //         name="BugOutlined"
  //         color={focused ? '#303342' : COLORS.GRAY_2}
  //         size={20}
  //       />
  //     ),
  //   },
  // },
})

export const MainAppStack = createStackNavigator(
  {
    MainApp: MainAppTab,
    MainAppFaceCamera,
  },
  { headerMode: 'none' },
)
