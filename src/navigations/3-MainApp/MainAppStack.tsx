import React from 'react'
import { Text } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MainApp } from './MainApp'
import { MainAppFaceCamera } from './MainAppFaceCamera'
import { QRCodeScan } from './QRCodeScan'
import { Settings } from './Settings'

export const MainAppTab = createBottomTabNavigator(
  {
    MainApp: {
      screen: MainApp,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              textAlign: 'center',
              fontSize: FONT_SIZES[500],
              fontFamily: FONT_FAMILY,              
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
            size={18}
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
              fontSize: FONT_SIZES[500],
              fontFamily: FONT_FAMILY,              
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
            size={18}
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
              fontSize: FONT_SIZES[500],
              fontFamily: FONT_FAMILY,              
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
            size={18}
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
    //           fontSize: FONT_SIZES[500],
    //           fontFamily: FONT_FAMILY,
  //           
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
    //         size={18}
    //       />
    //     ),
    //   },
    // },
  },
  {
    tabBarOptions: {
      style: {
        paddingTop: 8,
      },
    },
  },
)

export const MainAppStack = createStackNavigator(
  {
    MainApp: MainAppTab,
    MainAppFaceCamera,
  },
  { headerMode: 'none' },
)
