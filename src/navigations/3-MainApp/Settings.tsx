import React from 'react'
import {
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

const eventEmitter = new NativeEventEmitter(NativeModules.ContactTracerModule)

interface SettingsProps {}

interface SettingsState {
  statusText: string
  isServiceEnabled: boolean
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
  statusText = ''
  advertiserEventSubscription = null
  nearbyDeviceFoundEventSubscription = null

  constructor(props) {
    super(props)
    this.state = {
      statusText: '',
      isServiceEnabled: false,
    }
  }

  componentDidMount() {
    // Check if Tracer Service has been enabled
    NativeModules.ContactTracerModule.isTracerServiceEnabled()
      .then(enabled => {
        this.setState({
          isServiceEnabled: enabled,
        })
      })
      .then(() => {})

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

  appendStatusText(text) {
    this.statusText = text + '\n' + this.statusText
    this.setState({
      statusText: this.statusText,
    })
  }

  render() {
    return (
      <MyBackground variant="light">
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <View style={styles.body}>
              <View style={styles.horizontalRow}>
                <Text style={styles.normalText}>การค้นหาด้วยบลูทูธ: </Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={
                    this.state.isServiceEnabled ? '#f5dd4b' : '#f4f3f4'
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.onServiceSwitchChanged}
                  value={this.state.isServiceEnabled}
                />
              </View>
            </View>
            {/*
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
            >
              <Text>{this.state.statusText}</Text>
            </ScrollView>
            */}
          </View>
        </SafeAreaView>
      </MyBackground>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#ffffff',
    padding: 24,
  },
  horizontalRow: {
    marginTop: 24,
    flexDirection: 'row',
  },
  normalText: {
    fontSize: 16,
    color: '#000000',
  },
  mediumText: {
    fontSize: 20,
    color: '#000000',
  },
  largeText: {
    fontSize: 24,
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  scrollView: {
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
  },
})
