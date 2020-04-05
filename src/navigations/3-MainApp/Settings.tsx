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
import { useContactTracer } from '../../services/contact-tracing-provider'

export const Settings = () => {
  const { enable, disable, statusText, isServiceEnabled } = useContactTracer()
  console.log('isServiceEnabled', isServiceEnabled)
  return  (
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
                        isServiceEnabled ? '#f5dd4b' : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => isServiceEnabled? disable(): enable()}
                      value={isServiceEnabled}
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
          <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
            >
              <Text>{statusText}</Text>
            </ScrollView>
        </SafeAreaView>
      </MyBackground>
  )
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
