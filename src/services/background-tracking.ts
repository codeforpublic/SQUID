import BackgroundGeolocation from '../react-native-background-geolocation'
import BackgroundFetch from 'react-native-background-fetch'
import { getAnonymousHeaders, API_URL } from '../api'
import { AppState, Alert, Platform } from 'react-native'

class BackgroundTracking {
  private ready: boolean = false
  private started: boolean = false
  private appState: string = 'active'
  private latestKnownedUpdated?: number
  private debug: boolean = false
  async setup(startImmediately?: boolean) {
    await this.stop()
    AppState.addEventListener('change', this.onAppStateChange)
    BackgroundGeolocation.onHttp(async response => {
      let status = response.status
      let success = response.success
      let responseText = response.responseText
      console.log(
        'BackgroundGeolocation [onHttp] ',
        status,
        success,
        responseText,
      )
      this.latestKnownedUpdated = Date.now()
    })

    await BackgroundGeolocation.ready({
      distanceFilter: 50,
      stationaryRadius: 50,
      stopOnTerminate: false,
      startOnBoot: true,
      foregroundService: true,
      headers: await getAnonymousHeaders(),
      autoSync: true,
      debug: false,
      batchSync: true,
      maxBatchSize: 20,
      url: API_URL + '/location',
      httpRootProperty: 'locations',
      locationsOrderDirection: 'ASC',
      heartbeatInterval: 60 * 15,
      useSignificantChangesOnly: Platform.OS === 'android',
      locationAuthorizationAlert: {
        titleWhenNotEnabled: 'กรุณาเปิด Location services ให้ ThaiAlert',
        titleWhenOff: 'กรุณาเปิด Location services ให้ ThaiAlert',
        instructions:
          'เพื่อคอยแจ้งเตือนหากคุณได้ไปใกล้ชิดกับคนที่ความเสี่ยง หรืออยู่ในพื้นที่เสี่ยง',
        cancelButton: 'Cancel',
        settingsButton: 'Settings',
      },
      notification: {
        title: 'ระบบเฝ้าระวังของ ThaiAlert ทำงาน',
        text:
          'คุณจะได้รับการแจ้งเตือนทันที เมื่อคุณได้ไปใกล้ชิดกับคนที่มีความเสี่ยง',
      },
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      // locationAuthorizationAlert: {
      //   titleWhenNotEnabled: :
      // }
    })
    this.ready = true
    if (startImmediately) {
      await this.start()
    }
    // BackgroundFetch.configure({
    //   minimumFetchInterval: 30,
    //   // Android options
    //   stopOnTerminate: false,
    //   startOnBoot: true,
    //   requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
    //   requiresCharging: false,      // Default
    //   requiresDeviceIdle: false,    // Default
    //   requiresBatteryNotLow: false, // Default
    //   requiresStorageNotLow: false  // Default
    // }, async (taskId) => {
    //   console.log("[js] Received background-fetch event: ", taskId);
    //   if (this.started) {
    //     // trigger update location
    //     await this.getLocation({ triggerType: 'backgroundFetch' })
    //   }
    //   BackgroundFetch.finish(taskId);
    // }, (error) => {
    //   console.log("[js] RNBackgroundFetch failed to start");
    // });
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
  toggleDebug() {
    this.debug = !this.debug
    BackgroundGeolocation.setConfig({ debug: this.debug })
    Alert.alert('Debug Mode:' + (this.debug ? 'ON' : 'OFF'))
  }
  destroyLocations() {
    return BackgroundGeolocation.destroyLocations()
  }
  getLocation(extras?: any) {
    return BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      extras,
    })
  }
  onAppStateChange = state => {
    if (!this.started) {
      return
    }
    if (this.appState !== 'active' && state === 'active') {
      if (Date.now() - this.latestKnownedUpdated > 10 * 60 * 1000) {
        //  at least 10 min
        this.getLocation({ triggerType: 'appState' }) // trigger location
      }
    }
    this.appState = state
  }
}

export const backgroundTracking = new BackgroundTracking()
