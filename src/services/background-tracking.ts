import BackgroundGeolocation from 'react-native-background-geolocation'
import { getAnonymousHeaders } from '../api'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { StoreLocationHistoryService } from './store-location-history.service'
import BackgroundTimer from 'react-native-background-timer'
import GetLocation from 'react-native-get-location'
import { API_URL } from '../config'
import I18n from '../../i18n/i18n'

class BackgroundTracking {
  setup(startImmediately?: boolean) {
    if (startImmediately) {
      this.start()
    }
  }

  private registerGeoLocation() {
    const headers = getAnonymousHeaders()
    return BackgroundGeolocation.ready({
      // iOS
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      stationaryRadius: 25,

      // Android
      enableHeadless: false,
      allowIdenticalLocations: true,
      foregroundService: true,
      deferTime: 60 * 1000,

      // All
      locationUpdateInterval: 15 * 60 * 1000,
      distanceFilter: Platform.OS === 'android' ? 0 : 25,
      reset: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
      debug: false,
      autoSync: true,
      httpTimeout: Platform.OS === 'ios' ? 5000 : undefined,
      stopOnTerminate: false,
      startOnBoot: true,
      batchSync: true,
      maxBatchSize: 20,
      autoSyncThreshold: 10,
      headers,
      url: API_URL + '/location',
      httpRootProperty: 'locations',
      locationsOrderDirection: 'ASC',
      locationAuthorizationAlert: {
        titleWhenNotEnabled: I18n.t('pls_set_loc_serv_as_always'),
        titleWhenOff: I18n.t('pls_set_loc_serv_as_always'),
        instructions: I18n.t(
          'help_notify_if_you_get_near_risky_person_or_area',
        ),
        cancelButton: 'Cancel',
        settingsButton: 'Settings',
      },
      notification: {
        title: I18n.t('morchana_tracking_is_on'),
        text: I18n.t('you_will_be_notified_when_closed_to_risky_ppl'),
      },
    })
  }

  start() {
    if (!this.canUseGeoLocation) {
      return Promise.resolve()
    }

    BackgroundGeolocation.onLocation(({ coords }) => {
      this.saveLocationWFH(coords)
    }, console.log)
    BackgroundTimer.runBackgroundTimer(() => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1000,
      }).then((coords) => {
        this.saveLocationWFH(coords)
      })
    }, 60000)

    return this.registerGeoLocation().then((state) => {
      if (!state.enabled) {
        BackgroundGeolocation.start().catch(console.log)
      }
    })
  }

  stop() {
    if (!this.canUseGeoLocation) {
      return Promise.resolve()
    }
    BackgroundGeolocation.removeAllListeners()
    return BackgroundGeolocation.stop()
  }

  destroyLocations() {
    if (!this.canUseGeoLocation) {
      return Promise.resolve()
    }
    return BackgroundGeolocation.destroyLocations()
  }

  getLocation(extras: any = {}) {
    if (!this.canUseGeoLocation) {
      return Promise.resolve({ ...extras })
    }
    return this.registerGeoLocation().then(() => {
      return BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        ...extras,
      })
    })
  }

  saveLocationWFH(location: { latitude: number; longitude: number }) {
    StoreLocationHistoryService.calculateDistance(
      location.latitude,
      location.longitude,
    ).then((type) => {
      StoreLocationHistoryService.callStackData(type)
    })
  }

  get canUseGeoLocation() {
    const hasGMS = DeviceInfo.hasGmsSync()
    return Platform.OS === 'ios' || hasGMS
  }
}

export const backgroundTracking = new BackgroundTracking()
