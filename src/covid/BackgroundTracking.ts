import React from 'react'
import BackgroundGeolocation, {
  DeviceInfo,
  TransistorAuthorizationToken,
} from '../react-native-background-geolocation'
import * as TrackingUtil from './tracking'
import BackgroundFetch from 'react-native-background-fetch'
import { SQUID_API_URL, getHeaders } from '../common/api'
import { apolloClient } from '../apollo-client'
interface Props {
  onReady: () => any
}

export const refreshBackgroundTracking = () => {
  BackgroundGeolocation.setConfig({
    headers: getHeaders(apolloClient.cache, [
      'location:basic',
      'location:real_time',
    ]),
  }).then(config => {
    console.log('set config', config)
  })
}

export class BackgroundTracking extends React.Component<Props> {
  componentDidMount() {
    this.setupTracking()
  }
  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners()
    BackgroundGeolocation.stop()
  }

  async setupTracking() {
    let trackingId = await TrackingUtil.loadTrackingId()
    if (!trackingId) {
      trackingId = await TrackingUtil.generateTrackingId()
    }
    await BackgroundGeolocation.stop()

    BackgroundGeolocation.onHttp(async response => {
      let status = response.status
      let success = response.success
      let responseText = response.responseText
      console.log('[onHttp] ', status, success, responseText)
    })

    const headers = getHeaders(apolloClient.cache, [
      'location:basic',
      'location:real_time',
    ])

    BackgroundGeolocation.ready(
      {
        distanceFilter: 100,
        stopOnTerminate: false,
        startOnBoot: true,
        foregroundService: true,        
        headers,
        autoSync: false,
        debug: false,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      },
      async state => {
        if (!state.enabled) {
          try {
            await BackgroundGeolocation.start()
            this.props.onReady()
            console.log('- Start success')
          } catch (err) {
            console.error(err)
          }
        } else {
          this.props.onReady()
        }
      },
    )
  }
  render() {
    return null
  }
}
