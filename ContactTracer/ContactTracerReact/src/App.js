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

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isEnabled: false,
      userId: '',
      statusText: 'Hi',
    };

    getUserId().then(userId => {
      this.setState({userId: userId});
    });
  }

  toggleSwitch = () => {
    this.setState({
      isEnabled: !this.state.isEnabled,
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
                thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.toggleSwitch}
                value={this.state.isEnabled}
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
