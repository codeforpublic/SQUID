// export const App = () => null
import React, { Component, Context } from 'react'
import { NativeModules, Dimensions } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-community/async-storage'

import { createAppContainer } from 'react-navigation'
// import Navigator from './covid/Navigator'
import Navigator from './navigations/Navigator'
import { View, StyleSheet, Linking, Alert } from 'react-native'
import { NavigationContainerComponent } from 'react-navigation'
import { HUDProvider } from './HudView'
import SplashScreen from 'react-native-splash-screen'
import { COLORS } from './styles'
import codePush from 'react-native-code-push'
import { ApolloProvider } from '@apollo/react-hooks'
import { CachePersistor, persistCache } from 'apollo-cache-persist'
import { apolloClient, migrateState } from './apollo-client'
import { userPrivateData } from './state/userPrivateData'
import { backgroundTracking } from './services/background-tracking'
import { ContactTracerProvider } from './services/contact-tracing-provider'
import { applicationState } from './state/app-state'
import { ThemeProvider } from 'emotion-theming'

const AppContainer = createAppContainer(Navigator)

class App extends React.Component {
  _navigator: NavigationContainerComponent | null
  state: {
    loaded: boolean
    activateCallback?: Function
  }
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
    const persistor = new CachePersistor({
      cache: apolloClient.cache,
      storage: AsyncStorage,
    })
    return Promise.all([
      AsyncStorage.clear(),
      backgroundTracking.destroyLocations(),
      persistor.purge(),
    ])
  }
  async load() {
    if (process.env.NODE_ENV !== 'production') {
      // await this.purgeAll()
    }

    await Promise.all([
      applicationState.load(),
      userPrivateData.load(),
      // persistCache({
      //   cache: apolloClient.cache,
      //   storage: AsyncStorage,
      // }),
    ])
    // await migrateState(apolloClient)
    await backgroundTracking.setup(
      Boolean(applicationState.getData('isPassedOnboarding')),
    )    

    await NativeModules.ContactTracerModule.setUserId(
      userPrivateData.getAnonymousId(),
    )

    this.setState({ loaded: true }, () => {
      SplashScreen.hide()
    })
  }
  getTheme() {
    return {
      scaling: Dimensions.get('window').height / 818
    }
  }

  render() {
    if (!this.state.loaded) {
      return null
    }
    const theme = this.getTheme()
    console.log('theme', theme)
    return (
      <ThemeProvider theme={theme}>
        <ContactTracerProvider
          anonymousId={userPrivateData.getAnonymousId()}
          isPassedOnboarding={applicationState.getData('isPassedOnboarding')}
        >
          <SafeAreaProvider>
            <ApolloProvider client={apolloClient}>
              <HUDProvider>
                <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_DARK }}>
                  <AppContainer
                    uriPrefix="morchana://"
                    ref={(navigator) => {
                      this._navigator = navigator
                    }}
                  />
                </View>
              </HUDProvider>
            </ApolloProvider>
          </SafeAreaProvider>
        </ContactTracerProvider>
      </ThemeProvider>
    )
  }
}

export default codePush({
  // @ts-ignore
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
})(App)
