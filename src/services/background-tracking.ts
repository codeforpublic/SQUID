import BackgroundGeolocation from '../react-native-background-geolocation'
import { getAnonymousHeaders, API_URL } from '../api'
import { AppState } from 'react-native'

class BackgroundTracking {
  private ready: boolean = false
  private started: boolean = false
  private appState: string = 'active'
  private latestKnownedUpdated?: number
  async setup(startImmediately?: boolean) {
    await this.stop()
    AppState.addEventListener('change', this.onAppStateChange)
    BackgroundGeolocation.onHttp(async response => {
      let status = response.status
      let success = response.success
      let responseText = response.responseText
      console.log('BackgroundGeolocation [onHttp] ', status, success, responseText)
      this.latestKnownedUpdated = Date.now()
    })

    await BackgroundGeolocation.ready(
      {
        distanceFilter: 80,
        stopOnTerminate: false,
        startOnBoot: true,
        foregroundService: true,        
        headers: getAnonymousHeaders(),
        autoSync: true,
        debug: false,
        batchSync: true,
        url: API_URL + '/location',
        httpRootProperty: 'locations',
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        // locationAuthorizationAlert: {
        //   titleWhenNotEnabled: :
        // }
      }
    )
    this.ready = true
    if (startImmediately) {
      return this.start()
    }
  }
  async start() {
    if (!this.ready) {
      throw new Error(`BackgroundGeolocation'ven't configure yet`)
    }
    if (this.started) {
      return
    }
    this.started = true
    console.log('BackgroundGeolocation: started')
    await BackgroundGeolocation.start().catch(err => {
      console.error(err)
      this.started = false
      setTimeout(() => this.start(), 10 * 10000) // auto retry
    })    
  }
  stop() {
    this.started = false
    BackgroundGeolocation.removeAllListeners()
    return BackgroundGeolocation.stop()
  }
  destroyLocations() {
    return BackgroundGeolocation.destroyLocations()
  }
  getLocation() {
    return BackgroundGeolocation.getCurrentPosition({
      samples: 1
    })
  }
  onAppStateChange = (state) => {
    if (!this.started) {
      return
    }
    if (this.appState !== 'active' && state === 'active') {
      if (Date.now() - this.latestKnownedUpdated > 10 * 60 * 1000) { //  at least 10 min
        this.getLocation() // trigger location
      }
    }
    this.appState = state
  }
}

export const backgroundTracking = new BackgroundTracking()