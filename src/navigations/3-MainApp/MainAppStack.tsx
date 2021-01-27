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
          <View
            style={{
              marginBottom: FONT_SIZES[500],
            }}
          >
            <TabBarLabel title={I18n.t('data')} focused={focused} />
          </View>
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
          <View
            style={{
              marginBottom: FONT_SIZES[500],
            }}
          >
            <TabBarLabel title={I18n.t('scan_qr')} focused={focused} />
          </View>
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
          <View
            style={{
              marginBottom: FONT_SIZES[500],
            }}
          >
            <TabBarLabel title={I18n.t('settings')} focused={focused} />
          </View>
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
    Notification: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: ({ focused }: any) => (
          <View
            style={{
              marginBottom: FONT_SIZES[500],
            }}
          >  
          <TabBarLabel title={I18n.t('settings')} focused={focused} />
        </View>
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
  },
  {
    tabBarOptions: {
      labelStyle: {
        marginTop: FONT_SIZES[500] / 2,
      },
      tabStyle: {
        height: FONT_SIZES[500] * 5,
        paddingVertical: FONT_SIZES[500],
      },
      style: {
        marginBottom:10,
        backgroundColor:'#F9F9F9', 
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
