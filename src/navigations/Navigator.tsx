import React, { Component, Fragment, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import {
  createStackNavigator,
  StackActions,
  NavigationActions,
} from 'react-navigation'
import { COLORS } from '../styles'
import { AuthStack } from './1-Auth/AuthStack'
import { OnboardingStack } from './2-Onboarding/OnboardingStack'
import { MainAppTab } from './3-MainApp/MainAppStack'
import { applicationState } from '../state/app-state'

const isOnboarded = async () => {
  return applicationState.get('isPassedOnboarding')
}
const isRegistered = async () => {
  return applicationState.get('isRegistered')
}

// const REDIRECT_PAGE = 'AuthPhone'
// const REDIRECT_PARAMS = { data: { color: 'green', age: 25, gender: 'M', iat: 1585235348 } }

const Root = ({ navigation }) => {
  useEffect(() => {
    const redirect = async () => {
      const registered = await isRegistered()
      const onboarded = await isOnboarded()      
      const page = registered ? (onboarded ? 'MainApp' : 'Onboarding') : 'Auth'
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
      // if (REDIRECT_PAGE) {
      //   setTimeout(() => {
      //     navigation.navigate(REDIRECT_PAGE, REDIRECT_PARAMS)
      //   }, 500)
      // }
    }
    redirect()
  }, [])

  return <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_DARK }} />
}

export default createStackNavigator(
  {
    Root: {
      screen: Root,
    },
    Auth: {
      screen: AuthStack,
    },
    Onboarding: {
      screen: OnboardingStack,
    },
    MainApp: {
      screen: MainAppTab,
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
