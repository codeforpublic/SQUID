import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { applicationState } from '../state/app-state'
import { COLORS } from '../styles'
import { useResetTo } from '../utils/navigation'
import { HomeStack } from './0-Home/HomeStack'
import { OnboardingStack } from './2-Onboarding/OnboardingStack'
import { MainAppFaceCamera } from './3-MainApp/MainAppFaceCamera'
import MainAppTab from './3-MainApp/MainAppTab'
import { QuestionaireStack } from './4-Questionaire/QuestionaireStack'
import { SetLocationHome } from './5-SetLocation/SetLocationHome'
import { SetLocationMapWebView } from './5-SetLocation/SetLocationMapWebView'
import { SetLocationStack } from './5-SetLocation/SetLocationStack'
import { ChangeLanguageScreen } from './ChangeLanguage'
import { PrivacyPolicy } from './PrivacyPolicy'
import { WebviewScreen } from './Webview'
import { EditCoePersonalInformation } from './EditCoePersonalInformation'
import { OnboardRefIdEx } from './OnboardRefIdEx'
import { OnboardCoeEx } from './OnboardCoeEx'

const Root = () => {
  const resetTo = useResetTo()
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

      const routeName = isSkipRegistration ? (onboarded ? 'MainApp' : 'Onboarding') : 'Home'

      // const action = StackActions.navigate(routeName)
      resetTo({ name: routeName })
    }
    redirect()
  }, [resetTo])

  return <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_DARK }} />
}

const Stack = createStackNavigator()

export const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='Root'
      mode='modal'
      headerMode='none'
      screenOptions={{
        headerBackground: () => null,
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND,
        },
      }}
    >
      <Stack.Screen name='Root' component={Root} />
      <Stack.Screen name='Home' component={HomeStack} />
      <Stack.Screen name='Onboarding' component={OnboardingStack} />
      <Stack.Screen name='MainApp' component={MainAppTab} />
      <Stack.Screen name='MainAppFaceCamera' component={MainAppFaceCamera} />
      <Stack.Screen name='Questionaire' component={QuestionaireStack} />
      <Stack.Screen name='Webview' component={WebviewScreen} />
      <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
      <Stack.Screen name='EditCoePersonalInformation' component={EditCoePersonalInformation} />
      <Stack.Screen name='ChangeLanguage' component={ChangeLanguageScreen} />
      <Stack.Screen name='SetLocationHome' component={SetLocationHome} />
      <Stack.Screen name='SetLocationMapWebView' component={SetLocationMapWebView} />
      <Stack.Screen name='SetLocationStack' component={SetLocationStack} />
      <Stack.Screen name='OnboardRefIdEx' component={OnboardRefIdEx} />
      <Stack.Screen name='OnboardCoeEx' component={OnboardCoeEx} />
    </Stack.Navigator>
  )
}
export default Navigator
