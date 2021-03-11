import BackgroundGeolocation from 'react-native-background-geolocation'
import { getAnonymousHeaders } from '../api'
import { Platform } from 'react-native'
import { API_URL } from '../config'
import I18n from '../../i18n/i18n'
import DeviceInfo from 'react-native-device-info'
import HMSLocation from "@hmscore/react-native-hms-location";

class BackgroundTrackingHms {

private locationHmsRequest:HMSLocation.LocationRequest = {
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

private locationHms: HMSLocation.Location

private locationSettingsRequest = {
  locationRequests: [this.locationHmsRequest],
  alwaysShow: false,
  needBle: false,
};

private handleLocationUpdate = location => {
  var locationResult:HMSLocation.LocationResult = location
  this.locationHms = locationResult
  console.log("Retrieved HMS Location Lat:"+locationResult.lastLocation.latitude);
  console.log("Retrieved HMS Location Lat:"+locationResult.lastLocation.longitude);

};
  

  setup(startImmediately?: boolean) {
    if (startImmediately) {
      this.start()
    }
  }

  start() {
    if (!this.canUseGeoLocation) {
      return Promise.resolve()
    }
    HMSLocation.LocationKit.Native.init()
    .then(() => {
      console.log("HMS,Done loading")
      this.startHMSLocation()
    })
    .catch((err: Error) => console.log('HMS,Fused Location Headless Task, data:', err.message))
  }

  private startHMSLocation(){
    HMSLocation.FusedLocation.Native.requestLocationUpdates(10, this.locationHmsRequest)
    .then(({ requestCode }) => console.log("HMS Location RequestCode"+requestCode))
    .catch(err => console.log("Exception while requestLocationUpdates " + err))

    HMSLocation.FusedLocation.Events.addFusedLocationEventListener(
      this.handleLocationUpdate,
    );   
  }


  stop() {
    if (!this.canUseGeoLocation) {
      return Promise.resolve()
    }
    HMSLocation.FusedLocation.Events.removeFusedLocationEventListener(
      this.handleLocationUpdate,
    );
  }

  destroyLocations() {
    if (!this.canUseGeoLocation) {
      return Promise.resolve()
    }
  }

  getLocation(extras: any = {}) {
    if (!this.canUseGeoLocation) {
      return Promise.resolve({ ...extras })
    }
    return this.locationHms
  }

  get canUseGeoLocation() {
    const hasHMS = DeviceInfo.hasHmsSync()
    return Platform.OS !== 'ios' && hasHMS
  }
}

export const backgroundTrackingHms = new BackgroundTrackingHms()
