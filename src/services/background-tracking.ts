import BackgroundGeolocation from '../react-native-background-geolocation'
import BackgroundFetch from 'react-native-background-fetch'
import { getAnonymousHeaders } from '../api'
import { AppState, Alert, Platform } from 'react-native'
import { API_URL } from '../config'
import AsyncStorage from '@react-native-community/async-storage'
import { distance } from '../utils/distance'
import { StoreLocationHistoryService, LOCATION_TYPE } from './store-location-history.service'
import BackgroundTimer from 'react-native-background-timer'

import I18n from '../../i18n/i18n';

class BackgroundTracking {
  private ready: boolean = false
  private started: boolean = false
  private appState: string = 'active'
  private latestKnownedUpdated?: number

  private latestKnownedLogs: number = 0

  private debug: boolean = false
  private latestKnownedLogs: number = 0;

  private debug: boolean = false
  async setup(startImmediately?: boolean) {
    await this.stop()
    AppState.addEventListener('change', this.onAppStateChange)
    BackgroundGeolocation.onHttp(async response => {
      let status = response.status
      console.log('BackgroundGeolocation [onHttp] ', status)
      this.latestKnownedUpdated = Date.now()
    })

    this.onLocationTracking()

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
      preventSuspend: true,
      locationAuthorizationAlert: {
        titleWhenNotEnabled:
        I18n.t('pls_set_loc_serv_as_always'),
        titleWhenOff: I18n.t('pls_set_loc_serv_as_always'),
        instructions:
        I18n.t('help_notify_if_you_get_near_risky_person_or_area'),
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
    BackgroundGeolocation.startSchedule()
    await BackgroundGeolocation.start().catch(err => {
      this.started = false
      setTimeout(() => this.start(), 10 * 10000) // auto retry
    })
  }
  stop() {
    this.started = false
    BackgroundGeolocation.removeAllListeners()
    BackgroundGeolocation.stopSchedule()
    BackgroundTimer.stopBackgroundTimer()
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

  onLocationTracking = () => {
    const runBackgroundCallStackData = async() => {
      const { coords } = await this.getLocation()
      const type = await calculateDistance(coords.latitude, coords.longitude)
      //code that will be called every 60 seconds
      StoreLocationHistoryService.callStackData(type);
    }

    BackgroundTimer.runBackgroundTimer(async () => {
      await runBackgroundCallStackData();
    }, 600000); // 10 minute
    runBackgroundCallStackData();

    //rest of code will be performing for iOS on background too

    // BackgroundTimer.stopBackgroundTimer();
    const FIFTEEN_MIN = 60 * 1000
    BackgroundGeolocation.setConfig({
      heartbeatInterval: 60,
      preventSuspend: true,
    })

    const calculateDistance = async (latitude: number, longitude: number) => {
      const homeLocation = await AsyncStorage.getItem('HOME-LIST')
      const homes = homeLocation ? JSON.parse(homeLocation) : []
      const officeLocation = await AsyncStorage.getItem('OFFICE-LIST')
      const offices = officeLocation ? JSON.parse(officeLocation) : []
      const isHome =
        homes.length > 0
          ? distance(
              latitude,
              longitude,
              homes[0].latitude,
              homes[0].longitude,
            ) > 0.1
          : false
      const isOffice =
        offices.length > 0
          ? distance(
              latitude,
              longitude,
              offices[0].latitude,
              offices[0].longitude,
            ) > 0.1
          : false
      return isHome ? LOCATION_TYPE.HOME : isOffice ? LOCATION_TYPE.OFFICE : LOCATION_TYPE.OTHER;
    }

    // move
    BackgroundGeolocation.onLocation(async location => {
      console.log('[onLocation] ', new Date().toISOString())
      if (Date.now().valueOf() - this.latestKnownedLogs > FIFTEEN_MIN) {
        this.latestKnownedLogs = Date.now().valueOf()
        const log = await calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
        )
        const logsString = await AsyncStorage.getItem('history-wfh')
        const logs = logsString ? JSON.parse(logsString) : {}
        const newLogs = { ...logs, [Date.now()]: log }
        await AsyncStorage.setItem('history-wfh', JSON.stringify(newLogs))
      }
    })


    BackgroundGeolocation.onHeartbeat(async event => {
      console.log('[onHeartbeat] ', new Date().toISOString())
      if (Date.now().valueOf() - this.latestKnownedLogs > FIFTEEN_MIN) {
        this.latestKnownedLogs = Date.now().valueOf()
        const log = await calculateDistance(
          event.location.coords.latitude,
          event.location.coords.longitude,
        )
        const logsString = await AsyncStorage.getItem('history-wfh')
        const logs = logsString ? JSON.parse(logsString) : {}
        const newLogs = { ...logs, [Date.now()]: log }
        await AsyncStorage.setItem('history-wfh', JSON.stringify(newLogs))
        await StoreLocationHistoryService.trackLocationByTime(log)
      }
    })
  }
}

export const backgroundTracking = new BackgroundTracking()
