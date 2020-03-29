import BackgroundGeolocation from '../react-native-background-geolocation'
import { getAnonymousHeaders, API_URL } from '../api'

class BackgroundTracking {
  ready: boolean = false
  async setup(startImmediately?: boolean) {
    await BackgroundGeolocation.stop()

    BackgroundGeolocation.onHttp(async response => {
      let status = response.status
      let success = response.success
      let responseText = response.responseText
      console.log('[onHttp] ', status, success, responseText)
    })

    await BackgroundGeolocation.ready(
      {
        distanceFilter: 100,
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
  start() {
    if (!this.ready) {
      throw new Error(`BackgroundGeolocation'ven't configure yet`)
    }
    return BackgroundGeolocation.start()
  }
  stop() {
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
}

export const backgroundTracking = new BackgroundTracking()