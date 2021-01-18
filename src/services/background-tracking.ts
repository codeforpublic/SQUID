import BackgroundGeolocation from 'react-native-background-geolocation'
import { getAnonymousHeaders } from '../api'
import { Platform } from 'react-native'
import { API_URL } from '../config'
import I18n from '../../i18n/i18n'

// Custom JSON payload to send to server
// by default the payload will look like
// docs: https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#locationtemplate
/**
 {
      "coords": {
        "speed_accuracy": 0,
        "speed": 6.5899999999999999,
        "longitude": -122.02329798,
        "floor": 0,
        "heading_accuracy": 0,
        "latitude": 37.332160719999997,
        "accuracy": 10,
        "altitude_accuracy": -1,
        "altitude": 0,
        "heading": 347.52999999999997
      },
      "extras": {},
      "is_moving": true,
      "odometer": 1583.2,
      "uuid": "55FF6745-4786-4D72-A3CC-ED52067E0E4A",
      "activity": { "type": "unknown", "confidence": 100 },
      "battery": { "level": -1, "is_charging": false },
      "timestamp": "2021-01-17T08:32:27.572Z"
    }
 */
const LOCATION_TEMPLATE = `{
  "coords": {
    "longitude": <%= longitude %>,
    "latitude": <%= latitude %>,
    "accuracy": <%= accuracy %>,
  },
  "uuid": "<%= uuid %>",
  "timestamp": "<%= timestamp %>"
}`
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
      stationaryRadius: 50,

      // Android
      enableHeadless: false,
      allowIdenticalLocations: true,
      foregroundService: true,
      deferTime: 60 * 1000,

      // All
      locationTemplate: LOCATION_TEMPLATE,
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
    return this.registerGeoLocation().then((state) => {
      if (!state.enabled) {
        BackgroundGeolocation.start().catch(console.log)
      }
    })
  }

  stop() {
    BackgroundGeolocation.removeAllListeners()
    return BackgroundGeolocation.stop()
  }

  destroyLocations() {
    return BackgroundGeolocation.destroyLocations()
  }

  getLocation(extras: any = {}) {
    return this.registerGeoLocation().then(() => {
      return BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        ...extras,
      })
    })
  }
}

export const backgroundTracking = new BackgroundTracking()
