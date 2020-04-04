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
import { MainAppTab, MainAppStack } from './3-MainApp/MainAppStack'
import { applicationState } from '../state/app-state'
import { QuestionaireStack } from './4-Questionaire/QuestionaireStack'

const REDIRECT_PAGE = 'AuthOTP'
const REDIRECT_PARAMS = {
  data: { color: 'green', age: 25, gender: 'M', iat: 1585235348 },
}

const Root = ({ navigation }) => {
  useEffect(() => {
    const redirect = async () => {
      const registered = (
        applicationState.getData('isRegistered') ||
        applicationState.getData('skipRegistration')
      )
      const onboarded = applicationState.getData('isPassedOnboarding')
      const isFilledQuestionaire = applicationState.getData(
        'filledQuestionaire',
      )
      console.log('onboarded',onboarded,isFilledQuestionaire)
      const routeName = registered
        ? onboarded
          ? isFilledQuestionaire
            ? 'MainApp'
            : 'Questionaire'
          : 'Onboarding'
        : 'Auth'
      
      const action = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName //: 'Auth',
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
      screen: MainAppStack,
    },
    Questionaire: {
      screen: QuestionaireStack,
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
