import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { ThemeProvider } from 'emotion-theming'
import {
  Alert,
  AppState,
  AppStateStatus,
  Dimensions,
  NativeModules,
  View,
} from 'react-native'
import codePush from 'react-native-code-push'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import {
  createAppContainer,
  NavigationContainerComponent,
} from 'react-navigation'
import I18n from '../i18n/i18n'
import { CODEPUSH_DEPLOYMENT_KEY } from './config'
import { HUDProvider } from './HudView'
import Navigator from './navigations/Navigator'
import { backgroundTracking } from './services/background-tracking'
import { ContactTracerProvider } from './services/contact-tracing-provider'
import { NOTIFICATION_TYPES, pushNotification } from './services/notification'
import { applicationState } from './state/app-state'
import { userPrivateData } from './state/userPrivateData'
import { COLORS } from './styles'
import { compose } from './utils/compose'
import { refetchDDCPublicKey } from './utils/crypto'
import { refetchJWKs } from './utils/jwt'

const AppContainer = createAppContainer(Navigator)

class App extends React.Component {
  _navigator: NavigationContainerComponent | null
  state: {
    loaded: boolean
    activateCallback?: Function
    notificationTriggerNumber?: number
  }
  appState: AppStateStatus
  constructor(props) {
    super(props)
    this._navigator = null
    this.state = {
      loaded: false,
    }
  }
  componentDidMount() {
    this.load().catch((err) => {
      console.log('err', err)
      Alert.alert('Load app failed')
    })
  }
  purgeAll() {
    return Promise.all([
      AsyncStorage.clear(),
      backgroundTracking.destroyLocations(),
    ])
  }
  async load() {
    if (__DEV__) {
      // await this.purgeAll()
    }

    AppState.addEventListener('change', this.handleAppStateChange)

    const locale = () => AsyncStorage.getItem('locale')

    const credential = () =>
      Promise.all([
        applicationState.load(),
        userPrivateData.load(),
        refetchJWKs(),
      ]).catch((e) => console.log('CREDENTIAL ERROR', e))

    const setUpId = () =>
      NativeModules.ContactTracerModule.setUserId(
        userPrivateData.getAnonymousId(),
      )

    return Promise.all([
      locale(),
      credential(),
      setUpId(),
      refetchDDCPublicKey(),
    ])
      .then((resp) => {
        const lng = resp[0]
        I18n.locale = lng ? lng : 'th'

        backgroundTracking.setup(
          Boolean(applicationState.getData('isPassedOnboarding')),
        )

        this.setState({ loaded: true }, () => {
          SplashScreen.hide()
        })
      })
      .catch(console.log)
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
  onNavigatorLoaded() {
    pushNotification.configure(this.onNotification)
  }
  onNotification = (notification) => {
    this.setState({
      notificationTriggerNumber:
        (this.state.notificationTriggerNumber ?? 0) + 1,
    })

    const notificationData = notification?.data?.data || notification?.data
    if (!notificationData?.type) {
      return
    }
    const navigation = (this._navigator as any)._navigation
    switch (notificationData.type) {
      case NOTIFICATION_TYPES.OPEN: {
        if (notificationData.routeName) {
          navigation.navigate(notificationData.routeName)
        } else if (notificationData.url) {
          // Linking.openURL(notificationData.url)
          navigation.navigate('Webview', {
            uri: notificationData.url,
            onClose: () => {
              navigation.pop()
            },
          })
        }
        break
      }
    }
  }

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
              <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_DARK }}>
                <AppContainer
                  uriPrefix="morchana://"
                  ref={(navigator) => {
                    if (!this._navigator) {
                      this._navigator = navigator
                      this.onNavigatorLoaded()
                    }
                  }}
                />
              </View>
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
