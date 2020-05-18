import BackgroundGeolocation from '../react-native-background-geolocation'
import BackgroundFetch from 'react-native-background-fetch'
import { getAnonymousHeaders } from '../api'
import { AppState, Alert, Platform } from 'react-native'
import { API_URL } from '../config'

import I18n from '../../i18n/i18n';

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
      console.log('BackgroundGeolocation [onHttp] ', status)
      this.latestKnownedUpdated = Date.now()
    })

    const headers = getAnonymousHeaders()

    await BackgroundGeolocation.ready({
      distanceFilter: Platform.OS === 'android' ? 0 : 25, // every 25 meter
      locationUpdateInterval: 15 * 60 * 1000, // every 15 minute
      stationaryRadius: 50,
      stopOnTerminate: false,
      startOnBoot: true,
      foregroundService: true,
      headers,
      autoSync: true,
      debug: false,
      batchSync: true,
      maxBatchSize: 20,
      deferTime: 60 * 1000,
      url: API_URL + '/location',
      httpRootProperty: 'locations',
      locationsOrderDirection: 'ASC',
      heartbeatInterval: 60 * 15,
      locationAuthorizationAlert: {
        titleWhenNotEnabled:
        I18n.t('pls_set_loc_serv_as_always'),
        titleWhenOff: I18n.t('help_notify_if_you_get_near_risky_person_or_area'),
        instructions:
        I18n.t('so_we_can_warn_u'),
        cancelButton: 'Cancel',
        settingsButton: 'Settings',
      },
      notification: {
        title: I18n.t('morchana_tracking_is_on'),
        text:
        I18n.t('you_will_be_notified_when_closed_to_risky_ppl'),
      },
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    })
    this.ready = true
    if (startImmediately) {
      await this.start()
    }
    BackgroundFetch.stop()
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
  getLocation(extras: any = {}) {
    return BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      ...extras,
    })
  }
  onAppStateChange = state => {
    if (!this.started) {
      return
    }
    if (this.appState !== 'active' && state === 'active') {
      if (Date.now() - this.latestKnownedUpdated > 10 * 60 * 1000) {
        //  at least 10 min
        this.getLocation({ extras: { triggerType: 'appState' } }) // trigger location
      }
    }
    this.appState = state
  }
}

export const backgroundTracking = new BackgroundTracking()
