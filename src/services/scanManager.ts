import {  AppState } from 'react-native'
import { scan } from '../api'
import { backgroundTracking } from './background-tracking'

class ScanManager {
  list: string[] = []
  _it?: NodeJS.Timeout 
  constructor() {
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
    this._it = setTimeout(() => this.upload(), 30 * 1000) // 30 sec
  }
  add(annonymousId: string): boolean {    
    if (this.list.find(id => id === annonymousId)) {
      return false
    }
    this.list.push(annonymousId)
    if (!this._it) {
      this.startTimeout()
    }
    return true
  }
  async upload() {
    if (this.list.length > 0) {      
      const uploadList = this.list
      this.list = []
      clearTimeout(this._it)
      delete this._it
      try {
        const location = await backgroundTracking.getLocation()
        await scan(uploadList, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        })
      } catch (err) {
        console.log(err)
        this.list = this.list.concat(uploadList) // back to list
        if (!this._it) {
          this.startTimeout() // start timeout again
        }
      }
    }
  }
}

export const scanManager = new ScanManager()