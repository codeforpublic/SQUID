import React, { useEffect } from 'react'
import { View } from 'react-native'
import {
  createStackNavigator,
  NavigationActions,
  StackActions,
} from 'react-navigation'
import { applicationState } from '../state/app-state'
import { COLORS } from '../styles'
import { HomeStack } from './0-Home/HomeStack'
import { OnboardingStack } from './2-Onboarding/OnboardingStack'
import { MainAppStack } from './3-MainApp/MainAppStack'
import { QuestionaireStack } from './4-Questionaire/QuestionaireStack'
import { ChangeLanguageScreen } from './ChangeLanguage'
import { PrivacyPolicy } from './PrivacyPolicy'
import { WebviewScreen } from './Webview'

const Root = ({ navigation }) => {
  useEffect(() => {
    const redirect = async () => {
      const isSkipRegistration = applicationState.getData('skipRegistration')
      const onboarded = applicationState.getData('isPassedOnboarding')
      // const isFilledQuestionaire = applicationState.getData(
      //   'filledQuestionaireV2',
      // )
      // const routeName = isSkipRegistration
      //   ? onboarded
      //     ? isFilledQuestionaire
      //       ? 'MainApp'
      //       : 'Questionaire'
      //     : 'Onboarding'
      //   : 'Home'

      const routeName = isSkipRegistration
        ? onboarded
          ? 'MainApp'
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
  }, [navigation])

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
    // Auth: {
    //   screen: AuthStack,
    // },
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
    ChangeLanguage: {
      screen: ChangeLanguageScreen,
    },
  },
  {
    initialRouteName: 'Root',
    mode: 'modal',
    headerMode: 'none',
  },
)
