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
import { useContactTracer } from '../../services/contact-tracing-provider'

export const Settings = () => {
  const { enable, disable, statusText, isServiceEnabled } = useContactTracer()
  return  (
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
                  isServiceEnabled ? '#f5dd4b' : '#f4f3f4'
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => isServiceEnabled? disable(): enable()}
                value={isServiceEnabled}
              />
            </View>
          </View>
          
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          >
            <Text>{statusText}</Text>
          </ScrollView>
          
        </View>
      </SafeAreaView>
    </MyBackground>
  )
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
