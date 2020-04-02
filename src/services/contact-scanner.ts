import { AppState } from 'react-native'
import { scan } from '../api'
import { backgroundTracking } from './background-tracking'
import BackgroundGeolocation from 'react-native-background-geolocation'

class ScanManager {
  ttl: number
  list: string[] = []
  timeout?: NodeJS.Timeout
  locationAccuracy: number
  constructor({ ttl, locationAccuracy }) {
    this.locationAccuracy = locationAccuracy
    this.ttl = ttl
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
    this.timeout = setTimeout(() => this.upload(), this.ttl) // 30 sec
  }
  add(annonymousId: string): boolean {
    if (this.list.find(id => id === annonymousId)) {
      return false
    }
    this.list.push(annonymousId)
    if (!this.timeout) {
      this.startTimeout()
    }
    return true
  }
  async upload() {
    if (this.list.length > 0) {
      const uploadList = this.list
      this.list = []
      clearTimeout(this.timeout)
      delete this.timeout
      try {
        const location = await backgroundTracking.getLocation({
          desiredAccuracy: this.locationAccuracy,
        })
        await scan(uploadList, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        })
      } catch (err) {
        console.log(err)
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
  locationAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
})
export const slowPaceScanner = new ScanManager({
  ttl: 10 * 60 * 1000,
  locationAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW,
})
