import { AppState } from 'react-native'
import { scan } from '../api'
import { backgroundTracking } from './background-tracking'
import BackgroundGeolocation from 'react-native-background-geolocation'
import _ from 'lodash'
class ScanManager {
  ttl?: number
  list: string[] = []
  timeout?: NodeJS.Timeout
  locationAccuracy?: number
  latestUploadTS?: number
  oldestItemTS?: number
  oldestBeaconFoundTS?: number
  type: 'bluetooth' | 'qrscan'
  constructor({ ttl, locationAccuracy, type }: { ttl?: number, locationAccuracy?: number, type: 'bluetooth' | 'qrscan' }) {
    this.locationAccuracy = locationAccuracy
    this.ttl = ttl
    this.type = type
    let prevState
    AppState.addEventListener('change', state => {
      if (prevState !== state) {
        if (state === 'background') {
          this.upload() // trigger upload immediately when user go to background
        }
      }
      prevState = state
    })
  }
  private startTimeout() {
    if (this.ttl) {
      this.timeout = setTimeout(() => this.upload(), this.ttl) // 30 sec
    }
  }

  maskBeaconFound() {
    if (!this.oldestBeaconFoundTS) {
      this.oldestBeaconFoundTS = Date.now()
    }
  }

  add(anonymousId: string): boolean {
    if (this.list.find(id => id === anonymousId)) {
      return false
    }
    this.list.push(anonymousId)
    if (!this.oldestItemTS) {
      this.oldestItemTS = Date.now()
    }
    if (!this.timeout) {
      this.startTimeout()
    }
    return true
  }
  async upload() {
    if (this.list.length > 0) {
      const uploadList = _.uniq(this.list)
      this.list = []
      clearTimeout(this.timeout)
      delete this.timeout
      const oldestItemTS = this.oldestItemTS
      try {
        delete this.oldestItemTS
        delete this.oldestBeaconFoundTS
        const location = await backgroundTracking.getLocation({
          desiredAccuracy: this.locationAccuracy,
        })
        await scan(uploadList, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        }, this.type)
        this.latestUploadTS = Date.now()
      } catch (err) {
        console.log(err)
        this.oldestItemTS = oldestItemTS
        this.list = this.list.concat(uploadList) // back to list
        if (!this.timeout) {
          this.startTimeout() // start timeout again
        }
      }
    }
  }
}

export const scanManager = new ScanManager({
  ttl: 30 * 1000,
  type: 'qrscan',
  locationAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
})

export const bluetoothScanner = new ScanManager({
  type: 'bluetooth',
  locationAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW,
})

export const beaconScanner = new ScanManager({
  type: 'bluetooth',
  locationAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW,
})
