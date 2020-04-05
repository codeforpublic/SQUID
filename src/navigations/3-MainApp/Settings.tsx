import React, { useCallback } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  TouchableHighlight,
  NativeEventEmitter,
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { useNavigation } from 'react-navigation-hooks'
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
      .then((enabled) => {
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

  onAdvertiserMessageReceived = (e) => {
    this.appendStatusText(e['message'])
  }

  onNearbyDeviceFoundReceived = (e) => {
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

  _onPrivacyPolicyClicked = () => {}

  render() {
    return (
      <MyBackground variant="light">
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <View style={styles.sectionHeader}></View>
            <View style={styles.settingsSection}>
              <View style={styles.section}>
                <View style={styles.horizontalRow}>
                  <View style={styles.leftArea}>
                    <Text style={styles.sectionText}>การค้นหาด้วยบลูทูธ: </Text>
                  </View>
                  <View style={styles.rightArea}>
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
                <Text style={styles.sectionDescription}>
                  เปิดการค้นหาการเข้าใกล้บุคคลอื่นผ่านบลูทูธพลังงานต่ำโดยอัตโนมัติ
                  อาจส่งผลให้มือถือมีการใช้พลังงานมากกว่าปกติ
                  สามารถเลือกปิดได้ถ้าต้องการ
                  แต่ระบบจะไม่สามารถค้นหาอุปกรณ์อื่นโดยอัตโนมัติได้
                </Text>
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>ทั่วไป</Text>
            </View>
            <View style={styles.settingsSection}>
              <TouchableHighlight onPress={this._onPrivacyPolicyClicked}>
                <View style={styles.section}>
                  <Text style={styles.sectionText}>นโยบายความเป็นส่วนตัว</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </SafeAreaView>
      </MyBackground>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeader: {
    height: 56,
    justifyContent: 'flex-end',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  horizontalRow: {
    flexDirection: 'row',
  },
  leftArea: {
    flex: 1,
  },
  rightArea: {
    justifyContent: 'flex-start',
  },
  sectionText: {
    fontSize: 16,
    color: '#000000',
  },
  sectionDescription: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888',
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
