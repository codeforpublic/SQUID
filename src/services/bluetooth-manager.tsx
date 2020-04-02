import React, { useContext } from 'react'
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  NativeEventEmitter,
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import { COLORS } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserId } from './User'
import { requestLocationPermission } from './Permission'

const eventEmitter = new NativeEventEmitter(NativeModules.ContactTracerModule)

interface ContactTracerProps {}

interface ContactTracerState {
  isServiceEnabled: boolean
  isLocationPermissionGranted: boolean
  isBluetoothOn: boolean
  userId: string
  statusText: string
}

const Context = React.createContext<ContactTracerState>(null)

export class ContactTracerProvider extends React.Component<
  ContactTracerProps,
  ContactTracerState
> {
  statusText = ''
  advertiserEventSubscription = null
  nearbyDeviceFoundEventSubscription = null

  constructor(props) {
    super(props)
    this.state = {
      isServiceEnabled: false,
      isLocationPermissionGranted: false,
      isBluetoothOn: false,

      userId: '',

      statusText: this.statusText,
    }
  }

  componentDidMount() {
    console.log(NativeModules.ContactTracerModule)

    // Get saved user ID or generate a new one
    // TODO: Use the global userId instead of the local one. Remove User.tsx file if done
    getUserId()
      .then(userId => {
        this.setState({ userId: userId })
        return NativeModules.ContactTracerModule.setUserId(userId)
      })
      .then(userId => {})

    // Check if Tracer Service has been enabled
    NativeModules.ContactTracerModule.isTracerServiceEnabled()
      .then(enabled => {
        this.setState({
          isServiceEnabled: enabled,
        })
        // Refresh Tracer Service Status in case the service is down
        NativeModules.ContactTracerModule.refreshTracerServiceStatus()
      })
      .then(() => {})

    // Check if BLE is available
    NativeModules.ContactTracerModule.initialize()
      .then(result => {
        return NativeModules.ContactTracerModule.isBLEAvailable()
      })
      // For NativeModules.ContactTracerModule.isBLEAvailable()
      .then(isBLEAvailable => {
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
      .then(locationPermissionGranted => {
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
      .then(bluetoothOn => {
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
      .then(supported => {
        if (supported)
          this.appendStatusText('Mulitple Advertisement is supported')
        else this.appendStatusText('Mulitple Advertisement is NOT supported')
      })

    // Register Event Emitter
    if (Platform.OS == 'ios') {
      this.advertiserEventSubscription = eventEmitter.addListener(
        'AdvertiserMessage',
        this.onAdvertiserMessageReceived,
      )

      this.nearbyDeviceFoundEventSubscription = eventEmitter.addListener(
        'NearbyDeviceFound',
        this.onNearbyDeviceFoundReceived,
      )
    } else {
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

  componentWillUnmount() {
    // Unregister Event Emitter
    this.advertiserEventSubscription.remove()
    this.nearbyDeviceFoundEventSubscription.remove()
    this.advertiserEventSubscription = null
    this.nearbyDeviceFoundEventSubscription = null
  }

  appendStatusText(text) {
    this.statusText = text + '\n' + this.statusText
    this.setState({
      statusText: this.statusText,
    })
  }

  /**
   * User Event Handler
   */

  onServiceSwitchChanged = () => {
    if (this.state.isServiceEnabled) {
      // To turn off
      NativeModules.ContactTracerModule.disableTracerService().then(() => {})
    } else {
      // To turn on
      NativeModules.ContactTracerModule.enableTracerService().then(() => {})
    }
    this.setState({
      isServiceEnabled: !this.state.isServiceEnabled,
    })
  }

  /**
   * Event Emitting Handler
   */

  onAdvertiserMessageReceived = e => {
    this.appendStatusText(e['message'])
  }

  onNearbyDeviceFoundReceived = e => {
    this.appendStatusText('')
    this.appendStatusText('***** RSSI: ' + e['rssi'])
    this.appendStatusText('***** Found Nearby Device: ' + e['name'])
    this.appendStatusText('')
  }

  render() {
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