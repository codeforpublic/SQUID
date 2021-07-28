import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StyleSheet, Text } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome'
import I18n from '../../../i18n/i18n'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MainApp } from './NewMainApp'
import { NotificationHistory } from './NotificationHistory'
import { QRCodeScan } from './QRCodeScan'
import { Settings } from './Settings'

const TabBarLabel = ({ title, focused }: any) => {
  const colors = { color: focused ? '#303342' : COLORS.GRAY_2 }

  return <Text style={[styles.tabBarLabel, colors]}>{title}</Text>
}

const Tab = createBottomTabNavigator()

const getIconColor = (focused: boolean) => {
  return focused ? '#303342' : COLORS.GRAY_2
}

const styles = StyleSheet.create({
  tabBarLabel: {
    textAlign: 'center',
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
  },
})

const MainAppTab = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: { backgroundColor: COLORS.BACKGROUND, borderTopColor: 'transparent' },
      }}
    >
      <Tab.Screen
        name='Home'
        component={MainApp}
        options={{
          tabBarLabel: ({ focused }: any) => <TabBarLabel title={I18n.t('data')} focused={focused} />,
          tabBarIcon: ({ focused }: any) => <Icon name='user' color={getIconColor(focused)} size={16} />,
        }}
      />
      <Tab.Screen
        name='QRCodeScan'
        component={QRCodeScan}
        options={{
          tabBarLabel: ({ focused }: any) => <TabBarLabel title={I18n.t('scan_qr')} focused={focused} />,
          tabBarIcon: ({ focused }: any) => <AntIcon name='scan1' color={getIconColor(focused)} size={16} />,
        }}
      />
      <Tab.Screen
        name='Settings'
        component={Settings}
        options={{
          tabBarLabel: ({ focused }: any) => <TabBarLabel title={I18n.t('settings')} focused={focused} />,
          tabBarIcon: ({ focused }: any) => <AntIcon name='profile' color={getIconColor(focused)} size={16} />,
        }}
      />
      <Tab.Screen
        name='NotificationHistory'
        component={NotificationHistory}
        options={{
          tabBarLabel: ({ focused }: any) => <TabBarLabel title={I18n.t('notification_history')} focused={focused} />,
          tabBarIcon: ({ focused }: any) => <AntIcon name='bells' color={getIconColor(focused)} size={16} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainAppTab
