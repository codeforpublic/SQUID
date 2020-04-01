/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Switch,
} from 'react-native';
import {getUserId} from './User';
import {requestLocationPermission} from './Permission';

import ContactTracerModule from './ContactTracerBridge';

class App extends React.Component {
  statusText = '';

  constructor() {
    super();
    this.state = {
      isServiceChecked: false,
      isLocationPermissionGranted: false,
      isBluetoothOn: false,

      userId: '',

      statusText: this.statusText,
    };
  }

  componentDidMount() {
    // Get saved user ID or henerate a new one
    getUserId().then(userId => {
      this.setState({userId: userId});
    });

    // Bluetooth Features from Bridge
    ContactTracerModule.isBLEAvailable()
      .then(isBLEAvailable => {
        if (isBLEAvailable) {
          this.appendStatusText('BLE is available');
          // BLE is available, continue requesting Location Permission
          return requestLocationPermission();
        } else {
          // BLE is not available, don't do anything furthur since BLE is required
          this.appendStatusText('BLE is NOT available');
        }
      })
      .then(locationPermissionGranted => {
        this.setState({
          isLocationPermissionGranted: locationPermissionGranted,
        });
        if (locationPermissionGranted) {
          // Location permission is granted, try turning on Bluetooth now
          this.appendStatusText('Location permission is granted');
          return ContactTracerModule.tryToTurnBluetoothOn();
        } else {
          // Location permission is required, we cannot continue working without this permission
          this.appendStatusText('Location permission is NOT granted');
        }
      })
      .then(bluetoothOn => {
        this.setState({
          isBluetoothOn: bluetoothOn,
        });
        if (bluetoothOn) {
          this.appendStatusText('Bluetooth is On');
          // See if Multiple Advertisement is supported
          return ContactTracerModule.isMultipleAdvertisementSupported();
        } else {
          this.appendStatusText('Bluetooth is Off');
        }
      })
      .then(supported => {
        if (supported)
          this.appendStatusText('Mulitple Advertisement is supported');
        else this.appendStatusText('Mulitple Advertisement is NOT supported');
      });
  }

  appendStatusText(text) {
    this.statusText = text + '\n' + this.statusText;
    this.setState({
      statusText: this.statusText,
    });
  }

  onServiceSwitchChanged = () => {
    this.setState({
      isServiceChecked: !this.state.isServiceChecked,
    });
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <View>
              <Text style={styles.mediumText}>
                User ID: {this.state.userId}
              </Text>
            </View>
            <View style={styles.horizontalRow}>
              <Text style={styles.normalText}>Service: </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={this.state.isServiceChecked ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.onServiceSwitchChanged}
                value={this.state.isServiceChecked}
                disabled={
                  !this.state.isLocationPermissionGranted ||
                  !this.state.isBluetoothOn
                }
              />
            </View>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              <Text>{this.state.statusText}</Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
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
  },
});

export default App;
