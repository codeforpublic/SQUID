import React, { Component, Fragment, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import {
  createStackNavigator,
  StackActions,
  NavigationActions,
} from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'
import { COLORS } from '../styles'
import { AuthStack } from './1-Auth/AuthStack'
import { OnboardingStack } from './2-Onboarding/OnboardingStack'
import { MainAppStack } from './3-MainApp/MainAppStack'

const isOnboarded = async () => {  
  return false
}
const isRegistered = async () => {  
  return AsyncStorage.getItem('registered')
}
const REDIRECT_PAGE = 'QRCodeScan'

const Root = ({ navigation }) => {
  useEffect(() => {
    isRegistered().then(registered => {
      const page =  registered? 'MainApp' : isOnboarded? 'Auth': 'Onboarding'

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
      if (REDIRECT_PAGE) {
        setTimeout(() => {
          navigation.navigate(REDIRECT_PAGE)
        }, 500)
      }
    })
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
      screen: MainAppStack,
    }
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