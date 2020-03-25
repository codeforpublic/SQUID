// export const App = () => null
import React, { Component, Context } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-community/async-storage'

import { createAppContainer } from 'react-navigation'
import Navigator from './covid/Navigator'
import { BackgroundTracking } from './covid/BackgroundTracking'
import { View, StyleSheet, Linking, Alert } from 'react-native'
import { AppContext } from './AppContext'
import { NavigationContainerComponent } from 'react-navigation'
import { HUDProvider } from './HudView'
import SplashScreen from 'react-native-splash-screen'
import { COLORS } from './styles'

import { ApolloProvider } from '@apollo/react-hooks'
import { CachePersistor, persistCache } from 'apollo-cache-persist'
import { apolloClient, migrateState } from './apollo-client'

const AppContainer = createAppContainer(Navigator)

// checkApollo(ApolloProvider)
export default class App extends React.Component {
  _navigator: NavigationContainerComponent | null
  state: { startedTracked: boolean, loaded: boolean, activateCallback?: Function }
  constructor(props) {
    super(props)
    this._navigator = null
    this.state = {
      startedTracked: false,
      loaded: false,
    }
  }
  componentDidMount() {
    this.load().then(
      () => {
        this.setState({ loaded: true })
      },
      err => {
        console.log('err', err)
        Alert.alert('Load app failed')
      },
    )
  }
  purgeAll() {
    AsyncStorage.clear()
    const persistor = new CachePersistor({
      cache: apolloClient.cache,
      storage: AsyncStorage,
      // trigger: 'write',
      // debug: true,
    })
    return persistor.purge()
  }
  async load() {
    if (process.env.NODE_ENV !== 'production') {
      // await this.purgeAll()
    }
    const [result] = await Promise.all([
      AsyncStorage.getItem('is-passed-onboarding'),
      persistCache({
        cache: apolloClient.cache,
        storage: AsyncStorage,
        // trigger: 'write',
        // debug: true,
      }),
    ])
    await migrateState(apolloClient)
    
    if (result === 'success') {
      this.setState({ startedTracked: true })
    }
    SplashScreen.hide()
  }
  activateBackgroundTracking = callback => {
    AsyncStorage.setItem('is-passed-onboarding', 'success')
    this.setState({ startedTracked: true, activateCallback: callback })
  }

  render() {
    if (!this.state.loaded) {
      return null
    } 
    return (
      <SafeAreaProvider>
        <ApolloProvider client={apolloClient}>
          <HUDProvider>
            <AppContext.Provider
              value={{
                activateBackgroundTracking: this.activateBackgroundTracking,
              }}
            >
              <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_DARK }}>
                {this.state.startedTracked && (
                  <BackgroundTracking
                    onReady={() => {
                      if (this.state.activateCallback) {
                        this.state.activateCallback()
                      }
                    }}
                  />
                )}
                <AppContainer
                  uriPrefix="fightcovid19://"
                  ref={navigator => {
                    this._navigator = navigator
                  }}
                />
              </View>
            </AppContext.Provider>
          </HUDProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    )
  }
}
