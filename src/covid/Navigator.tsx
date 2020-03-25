import React, { Component, Fragment, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BackgroundTracking } from './BackgroundTracking'
import AsyncStorage from '@react-native-community/async-storage'

import {
  createStackNavigator,
  StackActions,
  NavigationActions,
} from 'react-navigation'
import { HomePage } from './HomePage'
import { AppFormStack } from './ApplicationForm/AppFormStack'
import { MainTab } from './MainTab'
import { COLORS } from '../styles'
import { PermissionOnboardingScreen } from './PermissionOnboarding/PermissionOnboardingScreen'

const Root = ({ navigation }) => {
  useEffect(() => {
    AsyncStorage.getItem('is-passed-onboarding').then(isPassedOnboarding => {
      console.log('isPassedOnboarding', isPassedOnboarding)
      const page = isPassedOnboarding === 'success' ? 'MainTab' : 'Home'

      const action = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: page,
          }),
        ],
        key: null,
      })
      navigation.dispatch(action)
    })
  }, [])

  return <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_DARK }} />
}

export default createStackNavigator(
  {
    Root: {
      screen: Root,
    },
    Home: {
      screen: HomePage,
    },
    AppForm: {
      screen: AppFormStack,
      path: '',
    },
    MainTab: {
      screen: MainTab,
    },
    PermissionOnboardingScreen: {
      screen: PermissionOnboardingScreen,
    },
  },
  {
    initialRouteName: 'Root',
    mode: 'modal',
    headerMode: 'none',
    onTransitionStart: (transition: any) => {
      let routeName = transition.scene.route.routeName
    },
  },
)
// const AppContainer = createAppContainer(AppNavigator)

// export default () => (
// <Fragment>
//     <AppContainer />
//     <BackgroundTracking />
//   </Fragment>
// )
