import React from "react";
import BackgroundGeolocation, {
  DeviceInfo,
  TransistorAuthorizationToken
} from "../react-native-background-geolocation";
import * as TrackingUtil from "./tracking";
import BackgroundFetch from "react-native-background-fetch";
import { SQUID_API_URL, getHeaders } from "../common/api";
import { apolloClient } from '../apollo-client'
interface Props {
  onReady: () => any;
}

export const refreshBackgroundTracking = () => {
  BackgroundGeolocation.setConfig({
    headers: getHeaders(apolloClient.cache, ["location:basic", "location:real_time"])
  }).then(config => {
    console.log('set config', config)
  })
}

export class BackgroundTracking extends React.Component<Props> {
  componentDidMount() {
    this.setupTracking();
    // this.setupBackgroundSync();
  }
  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();
  }
  async customSync(location: Object, extraInfo = {}) {
    console.log('customSync')
    const resp = await fetch("https://add3276c.ap.ngrok.io", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location,
        ...extraInfo
      })
    });
    console.log(resp.status, resp.statusText, await resp.text())
    return resp
  }
  async setupBackgroundSync() {
    console.log("setupBackgroundSync");
    const deviceInfo = await BackgroundGeolocation.getDeviceInfo();
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false // Default
      },
      async () => {
        const t1 = Date.now()
        console.log("[js] Received background-fetch event");
        console.log("count", await BackgroundGeolocation.getCount());
        try {
          await this.customSync(await BackgroundGeolocation.getLocations(), {
            device: {
              model: deviceInfo.model,
              platform: deviceInfo.platform,
              manufacturer: deviceInfo.manufacturer,
              version: deviceInfo.version,
              framework: "ReactNative"
            }
          })
          // await BackgroundGeolocation.sync()
          console.log("sync success");
        } catch (err) {
          console.log("sync failed", err);
        }
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        const t2 = Date.now()
        console.log('background sync', (t2 - t1), 'ms')
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      error => {
        console.log("[js] RNBackgroundFetch failed to start");
      }
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });
  }

  async setupTracking() {    
    console.log('setupTracking')
    let trackingId = await TrackingUtil.loadTrackingId();
    if (!trackingId) {
      trackingId = await TrackingUtil.generateTrackingId();
    }
    await BackgroundGeolocation.stop();    
    
    BackgroundGeolocation.onHttp(async response => {      
      let status = response.status;
      let success = response.success;
      let responseText = response.responseText;
      console.log("[onHttp] ", status, success, responseText);
    });

    const headers = getHeaders(apolloClient.cache, ["location:basic", "location:real_time"])
    
    BackgroundGeolocation.ready(
      {
        distanceFilter: 100,
        stopOnTerminate: false,
        startOnBoot: true,
        foregroundService: true,
        url: SQUID_API_URL + "/location",
        headers,
        autoSync: true,
        debug: false,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE
      },
      async state => {
        if (!state.enabled) {          
          try {
            await BackgroundGeolocation.start();
            this.props.onReady();
            console.log("- Start success");
          } catch (err) {
            console.error(err);
          }
        } else {
          this.props.onReady();
        }
      }
    );
  }
  render() {
    return null;
  }
}
