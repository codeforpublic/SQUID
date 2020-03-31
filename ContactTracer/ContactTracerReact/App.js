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

const App: () => React$Node = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <View>
            <Text style={styles.mediumText}>User ID: xxxx</Text>
          </View>
          <View style={styles.horizontalRow}>
            <Text style={styles.normalText}>Service: </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Text>{`
Hi~
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message.
this is a test message9.
this is a test message8.
this is a test message7.
this is a test message6.
this is a test message5.
this is a test message4.
this is a test message3.
this is a test message2.
this is a test message1.
this is a test message0.
`}</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

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
  scrollView: {},
});

export default App;
