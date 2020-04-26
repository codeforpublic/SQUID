import React from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContactTracer } from '../../services/contact-tracing-provider'
import { useNavigation } from 'react-navigation-hooks'
import { userPrivateData } from '../../state/userPrivateData'

export const Settings = () => {
  const navigation = useNavigation()
  const { enable, disable, statusText, isServiceEnabled } = useContactTracer()
  const isRegistered = Boolean(userPrivateData.getData('authToken'))
  const _onPrivacyPolicyClicked = () => {
    navigation.navigate('PrivacyPolicy')
  }

  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>ระบบค้นหา</Text>
            </View>
            <View style={styles.settingsSection}>
              <View style={[styles.section]}>
                <View style={styles.horizontalRow}>
                  <View style={styles.leftArea}>
                    <Text style={styles.sectionText}>การค้นหาด้วยบลูทูธ: </Text>
                  </View>
                  <View style={styles.rightArea}>
                    <Switch
                      trackColor={{
                        false: '#767577',
                        true: COLORS.PRIMARY_DARK,
                      }}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() =>
                        isServiceEnabled ? disable() : enable()
                      }
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
              <TouchableHighlight onPress={_onPrivacyPolicyClicked}>
                <View style={styles.section}>
                  <Text style={styles.sectionText}>นโยบายความเป็นส่วนตัว</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => navigation.navigate('Questionaire')}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionText}>
                    ทำแบบประเมินตนเองอีกครั้ง
                  </Text>
                </View>
              </TouchableHighlight>
              {!isRegistered && <TouchableHighlight
                onPress={() => navigation.navigate('AuthPhone', {
                  onBack: () => {
                    navigation.pop()
                  },
                  backIcon: 'close'
                })}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionText}>
                    ยืนยันตัวตน
                  </Text>
                </View>
              </TouchableHighlight>}
            </View>
          </View>
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
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_FAMILY
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
    fontSize: FONT_SIZES[600],
    color: '#000000',
    fontFamily: FONT_FAMILY,
  },
  sectionDescription: {
    marginTop: 4,
    fontSize: FONT_SIZES[500],
    color: '#888888',
    fontFamily: FONT_FAMILY,
  },
  mediumText: {
    fontSize: FONT_SIZES[600],
    color: '#000000',
  },
  largeText: {
    fontSize: FONT_SIZES[700],
    color: '#000000',
    fontFamily: FONT_FAMILY,
  },
  sectionTitle: {
    fontSize: FONT_SIZES[700],
    fontWeight: '600',
    color: '#000000',
    fontFamily: FONT_FAMILY,
  },
  scrollView: {},
})
