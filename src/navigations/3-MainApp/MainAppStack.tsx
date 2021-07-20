import React from 'react'
import { Platform, Text, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MainApp } from './NewMainApp'
import { MainAppFaceCamera } from './MainAppFaceCamera'
import { QRCodeScan } from './QRCodeScan'
import { Settings } from './Settings'
import { NotificationHistory } from './NotificationHistory'
import I18n from '../../../i18n/i18n';

const TabBarLabel = ({ title, focused }: any) => {
  return (
    <Text
      style={{
        textAlign: 'center',
        fontSize: FONT_SIZES[500],
        fontFamily: FONT_FAMILY,
        color: focused ? '#303342' : COLORS.GRAY_2,
      }}
    >
      {title}
    </Text>
  )
}

export const MainAppTab = createBottomTabNavigator(
  {
    MainApp: {
      screen: MainApp,
      navigationOptions: {
        tabBarLabel: ({ focused }: any) => (
            <TabBarLabel title={I18n.t('data')} focused={focused} />
        ),
        tabBarIcon: ({ focused }: any) => (
          <Icon
            name="user"
            color={focused ? '#303342' : COLORS.GRAY_2}
            size={16}
          />
        ),
      },
    },
    QRCodeScan: {
      screen: QRCodeScan,
      navigationOptions: {
        tabBarLabel: ({ focused }: any) => (
            <TabBarLabel title={I18n.t('scan_qr')} focused={focused} />
        ),
        tabBarIcon: ({ focused }: any) => (
          <AntIcon
            name="scan1"
            color={focused ? '#303342' : COLORS.GRAY_2}
            size={16}
          />
        ),
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: ({ focused }: any) => (
          <TabBarLabel title={I18n.t('settings')} focused={focused} />
        ),
        tabBarIcon: ({ focused }: any) => (
          <AntIcon
            name="profile"
            color={focused ? '#303342' : COLORS.GRAY_2}
            size={16}
          />
        ),
      },
    },
    NotificationHistory: {
      screen: NotificationHistory,
      navigationOptions: {
        tabBarLabel: ({ focused }: any) => (
          <TabBarLabel title={I18n.t('notification_history')} focused={focused} />
        ),
        tabBarIcon: ({ focused }: any) => (
          <AntIcon
            name="bells"
            color={focused ? '#303342' : COLORS.GRAY_2}
            size={16}
          />
        ),
      },
    },
    // Debug: {
    //   screen: Debug,
    //   navigationOptions: {
    //     tabBarLabel: ({ focused }: any) => (
    //       <TabBarLabel title={I18n.t('settings')} focused={focused} />
    //     ),
    //     tabBarIcon: ({ focused }: any) => (
    //       <AntIcon
    //         name="bells"
    //         color={focused ? '#303342' : COLORS.GRAY_2}
    //         size={16}
    //       />
    //     ),
    //   },
    // },
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#F9F9F9', 
        borderTopColor: 'transparent',
      },
    }
  }
)

export const MainAppStack = createStackNavigator(
  {
    MainApp: MainAppTab,
    MainAppFaceCamera,
  },
  { headerMode: 'none' },
)
