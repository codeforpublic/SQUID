import AsyncStorage from '@react-native-community/async-storage'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider } from 'emotion-theming'
import React from 'react'
import { Alert, AppState, AppStateStatus, Dimensions, NativeModules, View } from 'react-native'
import codePush from 'react-native-code-push'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import I18n from '../i18n/i18n'
import { CODEPUSH_DEPLOYMENT_KEY } from './config'
import { HUDProvider } from './HudView'
import Navigator from './navigations/Navigator'
import { backgroundTracking } from './services/background-tracking'
import { ContactTracerProvider } from './services/contact-tracing-provider'
import { NOTIFICATION_TYPES, pushNotification } from './services/notification'
import { VaccineProvider } from './services/use-vaccine'
import { applicationState } from './state/app-state'
import { userPrivateData } from './state/userPrivateData'
import { COLORS } from './styles'
import { compose } from './utils/compose'
import { refetchDDCPublicKey } from './utils/crypto'
import { refetchJWKs } from './utils/jwt'

// const AppContainer = createAppContainer(Navigator)
const Stack = createStackNavigator()

class App extends React.Component {
  state: {
    loaded: boolean
    activateCallback?: Function
    notificationTriggerNumber?: number
  }
  appState: AppStateStatus
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }
  componentDidMount() {
    this.load().catch((err) => {
      console.log('err', err)
      Alert.alert('Load app failed')
    })
    this.onNavigatorLoaded()
  }
  purgeAll() {
    return Promise.all([AsyncStorage.clear(), backgroundTracking.destroyLocations()])
  }

  async load() {
    if (__DEV__) {
      // await this.purgeAll()
    }

    AppState.addEventListener('change', this.handleAppStateChange)

    const locale = () => AsyncStorage.getItem('locale')

    const credential = () =>
      Promise.all([applicationState.load(), userPrivateData.load(), refetchJWKs()]).catch((e) =>
        console.log('CREDENTIAL ERROR', e),
      )

    const setUpId = () => NativeModules.ContactTracerModule.setUserId(userPrivateData.getAnonymousId())

    return Promise.all([locale(), credential(), setUpId(), refetchDDCPublicKey()])
      .then((resp) => {
        const lng = resp[0]
        if (lng) I18n.locale = lng

        backgroundTracking.setup(Boolean(applicationState.getData('isPassedOnboarding')))

        this.setState({ loaded: true }, () => {
          SplashScreen.hide()
        })
      })
      .catch(console.warn)
  }
  handleAppStateChange(state: AppStateStatus) {
    if (this.appState !== state) {
      if (state === 'active') {
        refetchJWKs()
      }
    }
    this.appState = state
  }
  getTheme() {
    return {
      scaling: Dimensions.get('window').height / 818,
    }
  }
  onNavigatorLoaded = () => {
    pushNotification.configure((notification) => {
      this.setState({
        notificationTriggerNumber: (this.state.notificationTriggerNumber ?? 0) + 1,
      })

      const notificationData = notification?.data?.data || notification?.data
      if (!notificationData?.type) {
        return
      }
      switch (notificationData.type) {
        case NOTIFICATION_TYPES.OPEN: {
          if (notificationData.routeName) {
            this.navRef.current?.navigate(notificationData.routeName)
          } else if (notificationData.url) {
            // Linking.openURL(notificationData.url)
            this.navRef.current?.navigate('Webview', {
              uri: notificationData.url,
              onClose: () => {
                this.navRef.current?.goBack()
              },
            })
          }
          break
        }
      }
    })
  }

  navRef = React.createRef<NavigationContainerRef>()
  render() {
    if (!this.state.loaded) {
      return null
    }
    const theme = this.getTheme()

    return (
      <ThemeProvider theme={theme}>
        <ContactTracerProvider
          anonymousId={userPrivateData.getAnonymousId()}
          isPassedOnboarding={applicationState.getData('isPassedOnboarding')}
          notificationTriggerNumber={this.state.notificationTriggerNumber ?? 0}
        >
          <SafeAreaProvider>
            <HUDProvider>
              <VaccineProvider>
                <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
                  <NavigationContainer linking={{ prefixes: ['morchana://'] }} ref={this.navRef}>
                    <Stack.Navigator
                      headerMode='none'
                      screenOptions={{
                        headerStyle: {
                          backgroundColor: '#F9F9F9',
                        },
                        headerTintColor: '#F9F9F9',
                      }}
                    >
                      <Stack.Screen name='Navigator' component={Navigator} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </View>
              </VaccineProvider>
            </HUDProvider>
          </SafeAreaProvider>
        </ContactTracerProvider>
      </ThemeProvider>
    )
  }
}

export default compose(
  CODEPUSH_DEPLOYMENT_KEY
    ? codePush({
        // @ts-ignore
        installMode: codePush.InstallMode.IMMEDIATE,
        checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
        deploymentKey: CODEPUSH_DEPLOYMENT_KEY,
      })
    : (c) => c,
)(App)
