import React, { Fragment, useEffect } from 'react'
import { View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { createBottomTabNavigator, StackActions, NavigationActions } from 'react-navigation'
import { COLORS } from '../styles'
import { ApplicationStack } from './ApplicationTab/ApplicationStack'
import { ProfileTabStack } from './Profile/ProfileTab'
import { QRTab } from './QRTab'
import { MissingPermissionsAlertHandler } from './MissingPermissionsAlertHandler'
import { useSafeArea } from 'react-native-safe-area-context'
import { checkReact } from '../common/util'
import { useApplicationList } from '../common/state/application.state'
import { DEFAULT_APPLICATION_ID } from './const'
import AsyncStorage from '@react-native-community/async-storage'


const Noop = () => null

const DISABLED_TABS = ['Stats']

const BaseTab = createBottomTabNavigator(
  {
    Stats: Noop,
    Application: ApplicationStack,
    Me: ProfileTabStack,
    QRCode: QRTab,
  },
  {
    initialRouteName: 'Application',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (DISABLED_TABS.indexOf(navigation.state.routeName) >= 0) {
          return null
        }
        defaultHandler()
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        let IconComponent = SimpleLineIcons
        let iconName = ''
        if (routeName === 'Stats') {
          iconName = `graph`
        } else if (routeName === 'Application') {
          iconName = `location-pin`
        } else if (routeName === 'Me') {
          iconName = `user`
        } else {
          IconComponent = AntDesign
          iconName = 'qrcode'
        }

        // You can return any component that you like here!
        return (
          <Fragment>
            <IconComponent
              name={iconName}
              size={24}
              color={
                focused
                  ? tintColor
                  : DISABLED_TABS.indexOf(routeName) >= 0
                  ? '#777'
                  : 'white'
              }
            />
            {focused && (
              <View
                style={{
                  width: 72,
                  height: 6,
                  position: 'absolute',
                  bottom: -3,
                  backgroundColor: tintColor,
                }}
              />
            )}
          </Fragment>
        )
      },
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: COLORS.ORANGE,
      style: {
        backgroundColor: COLORS.PRIMARY_DARK,
        borderTopWidth: 0,
      },
    },
  },
)

export const MainTab = ({ navigation }) => {
  const insets = useSafeArea()
  const [applications, loading] = useApplicationList()

  useEffect(() => {
    if (loading) {
      return
    }
    AsyncStorage.getItem('optOutCampaign').then((isOptOut) => {
      console.log('isOptOut', isOptOut)
      if (isOptOut) {
        return
      }
      const defaultApp = applications?.find(app => app.id === DEFAULT_APPLICATION_ID)
      console.log('defaultApp', defaultApp)
      if (!defaultApp) {        
        setTimeout(() => {
          navigation.navigate("AppForm", {
            applicationId: DEFAULT_APPLICATION_ID,
            permissions: ['data:id', 'location:real_time']
          })
        }, 0)
      }
    })
  }, [loading])
  return (
    <Fragment>
      <View style={{ paddingTop: insets.top, backgroundColor: COLORS.PRIMARY_DARK }} />
      <MissingPermissionsAlertHandler />
      <BaseTab navigation={navigation} />
    </Fragment>
  )
}
MainTab.router = BaseTab.router;