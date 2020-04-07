import React, { useContext } from 'react'
import {
  NativeEventEmitter,
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import { requestLocationPermission } from '../utils/Permission'
import { bluetoothScanner } from './contact-scanner'

const eventEmitter = new NativeEventEmitter(NativeModules.ContactTracerModule)

interface ContactTracerProps {
  anonymousId: string
  isPassedOnboarding: boolean
}

interface ContactTracerState {
  isServiceEnabled: boolean
  isLocationPermissionGranted: boolean
  isBluetoothOn: boolean
  anonymousId: string
  statusText: string
  enable: () => void
  disable: () => void
}

const Context = React.createContext<ContactTracerState>(null)

export class ContactTracerProvider extends React.Component<
  ContactTracerProps,
  ContactTracerState
> {
  private isInited = false
  private statusText = ''
  private advertiserEventSubscription = null
  private nearbyDeviceFoundEventSubscription = null

  constructor(props) {
    super(props)
    this.state = {
      isServiceEnabled: false,
      isLocationPermissionGranted: false,
      isBluetoothOn: false,
      anonymousId: '',
      statusText: this.statusText,
      enable: this.enable.bind(this),
      disable: this.disable.bind(this),
    }
  }

  componentDidMount() {
    this.registerListeners()

    NativeModules.ContactTracerModule.stopTracerService()
    if (this.props.isPassedOnboarding) {
      // Check if Tracer Service has been enabled
      NativeModules.ContactTracerModule.isTracerServiceEnabled()
        .then((enabled) => {
          this.setState({
            isServiceEnabled: enabled,
          })
          // Refresh Tracer Service Status in case the service is down
          if (enabled) return this.enable()
          return ''
        })
        .then(() => {})
    }
  }

  componentWillUnmount() {
    this.unregisterListeneres()
  }

  /**
   * Initialize Contact Tracer instance
   */
  async init() {
    this.isInited = true
    const anonymousId = this.props.anonymousId
    this.setState({ anonymousId: anonymousId })
    NativeModules.ContactTracerModule.setUserId(
      anonymousId,
    ).then((anonymousId) => {})

    // Check if Tracer Service has been enabled
    NativeModules.ContactTracerModule.isTracerServiceEnabled()
      .then((enabled) => {
        this.setState({
          isServiceEnabled: enabled,
        })
        // Refresh Tracer Service Status in case the service is down
        NativeModules.ContactTracerModule.refreshTracerServiceStatus()
      })
      .then(() => {})

    // Check if BLE is available
    await NativeModules.ContactTracerModule.initialize()
      .then((result) => {
        return NativeModules.ContactTracerModule.isBLEAvailable()
      })
      // For NativeModules.ContactTracerModule.isBLEAvailable()
      .then((isBLEAvailable) => {
        if (isBLEAvailable) {
          this.appendStatusText('BLE is available')
          // BLE is available, continue requesting Location Permission
          return requestLocationPermission()
        } else {
          // BLE is not available, don't do anything furthur since BLE is required
          this.appendStatusText('BLE is NOT available')
        }
      })
      // For requestLocationPermission()
      .then((locationPermissionGranted) => {
        this.setState({
          isLocationPermissionGranted: locationPermissionGranted,
        })
        if (locationPermissionGranted) {
          // Location permission is granted, try turning on Bluetooth now
          this.appendStatusText('Location permission is granted')
          return NativeModules.ContactTracerModule.tryToTurnBluetoothOn()
        } else {
          // Location permission is required, we cannot continue working without this permission
          this.appendStatusText('Location permission is NOT granted')
        }
      })
      // For NativeModules.ContactTracerModule.tryToTurnBluetoothOn()
      .then((bluetoothOn) => {
        this.setState({
          isBluetoothOn: bluetoothOn,
        })

        if (bluetoothOn) {
          this.appendStatusText('Bluetooth is On')
          // See if Multiple Advertisement is supported
          // Refresh Tracer Service Status in case the service is down
          NativeModules.ContactTracerModule.refreshTracerServiceStatus()
          return NativeModules.ContactTracerModule.isMultipleAdvertisementSupported()
        } else {
          this.appendStatusText('Bluetooth is Off')
        }
      })
      // For NativeModules.ContactTracerModule.isMultipleAdvertisementSupported()
      .then((supported) => {
        if (supported)
          this.appendStatusText('Mulitple Advertisement is supported')
        else this.appendStatusText('Mulitple Advertisement is NOT supported')
      })

    console.log('init complete')
  }

  /**
   * Enable Contact Tracer service
   *
   * Could be call only once and it will remember its state in persistant storage
   */
  async enable() {
    console.log('enable tracing')
    if (!this.isInited) {
      await this.init()
    }

    NativeModules.ContactTracerModule.enableTracerService().then(() => {})
    this.setState({
      isServiceEnabled: true,
    })
  }

  /**
   * Disable Contact Tracer service
   *
   * Could be call only once and it will remember its state in persistant storage
   */
  disable() {
    console.log('disable tracing')
    NativeModules.ContactTracerModule.disableTracerService()
    this.setState({
      isServiceEnabled: false,
    })
  }

  /**
   * Read Contact Tracer service latest state
   *
   * Read state, set isServiceEnabled and call enable() to init
   */
  refreshTracerService() {
    NativeModules.ContactTracerModule.isTracerServiceEnabled()
      .then((enabled) => {
        this.setState({
          isServiceEnabled: enabled,
        })
        // Refresh Tracer Service Status in case the service is down
        if (enabled) return this.enable()
        else return ''
      })
      .then(() => {})
  }

  /**
   * Initialize Listeners
   */
  registerListeners() {
    // Register Event Emitter
    if (Platform.OS == 'ios') {
      console.log('add listener')
      this.advertiserEventSubscription = eventEmitter.addListener(
        'AdvertiserMessage',
        this.onAdvertiserMessageReceived,
      )

      this.nearbyDeviceFoundEventSubscription = eventEmitter.addListener(
        'NearbyDeviceFound',
        this.onNearbyDeviceFoundReceived,
      )
    } else {
      console.log('add listener')
      this.advertiserEventSubscription = DeviceEventEmitter.addListener(
        'AdvertiserMessage',
        this.onAdvertiserMessageReceived,
      )

      this.nearbyDeviceFoundEventSubscription = DeviceEventEmitter.addListener(
        'NearbyDeviceFound',
        this.onNearbyDeviceFoundReceived,
      )
    }
  }

  /**
   * Destroy Listeners
   */
  unregisterListeneres() {
    // Unregister Event Emitter
    if (this.advertiserEventSubscription != null) {
      this.advertiserEventSubscription.remove()
      this.advertiserEventSubscription = null
    }
    if (this.nearbyDeviceFoundEventSubscription != null) {
      this.nearbyDeviceFoundEventSubscription.remove()
      this.nearbyDeviceFoundEventSubscription = null
    }
  }

  /**
   * Append debug text
   *
   * @param text Message to be appended
   */
  appendStatusText(text) {
    console.log('tracing status', text)
    this.statusText = text + '\n' + this.statusText
    this.setState({
      statusText: this.statusText,
    })
  }

  /**
   * Event Emitting Handler
   */

  onAdvertiserMessageReceived = (e) => {
    this.appendStatusText(e['message'])
  }

  onNearbyDeviceFoundReceived = (e) => {
    this.appendStatusText('')
    this.appendStatusText('***** RSSI: ' + e['rssi'])
    this.appendStatusText('***** Found Nearby Device: ' + e['name'])
    this.appendStatusText('')
    /* broadcast */
    console.log('broadcast:' + e['name'])
    bluetoothScanner.add(e['name'])
    if (Date.now() - bluetoothScanner.oldestItemTS > 10 * 60 * 1000) {
      bluetoothScanner.upload()
    }
  }

  render() {
    console.log('contact tracing', this.state)
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const useContactTracer = (): ContactTracerState => {
  return useContext(Context)
}
