import BackgroundGeolocation from 'react-native-background-geolocation'
import { getAnonymousHeaders } from '../api'
import { Platform,NativeModules } from 'react-native'
import { API_URL } from '../config'
import I18n from '../../i18n/i18n'
import HMSLocation from "@hmscore/react-native-hms-location";


const locationHmsRequest = {
  priority: HMSLocation.FusedLocation.PriorityConstants.PRIORITY_BALANCED_POWER_ACCURACY,
  // interval: 5*60*1000,
  interval: 1000,
  numUpdates: 2147483647,
  fastestInterval: 600000.0,
  expirationTime: 9223372036854775807.0,
  expirationTimeDuration: 10000.0,
  smallestDisplacement: 0.0,
  maxWaitTime: 0.0,
  needAddress: false,
  language: "",
  countryCode: "",
};

var locationHms: HMSLocation.Location
const locationSettingsRequest = {
  locationRequests: [locationHmsRequest],
  alwaysShow: false,
  needBle: false,
};

const handleLocationUpdate = location => {
  var locationResult:HMSLocation.LocationResult = location
  locationHms = locationResult
  console.log("Retrieved HMS Location Lat:"+locationResult.lastLocation.latitude);
  console.log("Retrieved HMS Location Lat:"+locationResult.lastLocation.longitude);

};

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

    if(Platform.OS === 'ios' ||  NativeModules.HMSBase.isGmsAvailable() === true){
      return this.registerGeoLocation().then((state) => {
        if (!state.enabled) {
          BackgroundGeolocation.start().catch(console.log)
        }
      })
    }else{
      HMSLocation.LocationKit.Native.init()
      .then(() => {
        console.log("HMS,Done loading")
        this.startHMSLocation()
      })
      .catch((err: Error) => console.log('HMS,Fused Location Headless Task, data:', err.message))
    }
  }

  startHMSLocation(){
    HMSLocation.FusedLocation.Native.requestLocationUpdates(10, locationHmsRequest)
    .then(({ requestCode }) => console.log("HMS Location RequestCode"+requestCode))
    .catch(err => console.log("Exception while requestLocationUpdates " + err))

    HMSLocation.FusedLocation.Events.addFusedLocationEventListener(
      handleLocationUpdate,
    );   
  }

  stop() {
    if(Platform.OS === 'ios' ||  NativeModules.HMSBase.isGmsAvailable() === true){
      BackgroundGeolocation.removeAllListeners()
      return BackgroundGeolocation.stop()
    }else{
      HMSLocation.FusedLocation.Events.removeFusedLocationEventListener(
        handleLocationUpdate,
      );
    }
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

  getLocationHms(){
    return locationHms
  }
}

export const backgroundTracking = new BackgroundTracking()
