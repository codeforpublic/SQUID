import React, { useEffect } from 'react'
import { View } from 'react-native'

import {
  createStackNavigator,
  StackActions,
  NavigationActions,
} from 'react-navigation'
import { COLORS } from '../styles'
import { AuthStack } from './1-Auth/AuthStack'
import { OnboardingStack } from './2-Onboarding/OnboardingStack'
import { MainAppStack } from './3-MainApp/MainAppStack'
import { applicationState } from '../state/app-state'
import { QuestionaireStack } from './4-Questionaire/QuestionaireStack'
import { PrivacyPolicy } from './PrivacyPolicy'
import { HomeStack } from './0-Home/HomeStack'
import { WebviewScreen } from './Webview'
import { ChangeLanguageScreen } from './ChangeLanguage'
import { SetLocationStack } from './5-SetLocation/SetLocationStack'
import { LocationReport } from './3-MainApp/LocationReport'
import { SetLocationHome } from './5-SetLocation/SetLocationHome'

const Root = ({ navigation }) => {
  useEffect(() => {
    const redirect = async () => {
      const isSkipRegistration = applicationState.getData('skipRegistration')
      const onboarded = applicationState.getData('isPassedOnboarding')
      const isFilledQuestionaire = applicationState.getData(
        'filledQuestionaireV2',
      )
      // const isEnterCoded = true; // TODO: waiting for next sprint

      const routeName = isSkipRegistration
        ? onboarded
          ? isFilledQuestionaire
            ? 'MainApp'
            : 'Questionaire'
          : 'Onboarding'
        : 'Home'

      const action = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName,
          }),
        ],
        key: null,
      })
      navigation.dispatch(action)
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
    Home: {
      screen: HomeStack,
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
    Webview: {
      screen: WebviewScreen,
    },
    PrivacyPolicy: {
      screen: PrivacyPolicy,
    },
    SetLocation: {
      screen: SetLocationStack,
    },
    ChangeLanguage: {
      screen: ChangeLanguageScreen,
    },
    LocationReport: {
      screen: LocationReport,
    },
    SetLocationHome: {
      screen: SetLocationHome
    }
  },
  {
    initialRouteName: 'Root',
    mode: 'modal',
    headerMode: 'none',
  },
)
