import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Image,
} from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'
import { ApplicationMutation } from '../../common/state/application.state'
import { useSafeArea } from 'react-native-safe-area-context'
import SvgUri from 'react-native-svg-uri-reborn'
import { CheckBox, Icon } from 'react-native-elements'
import { DangerButton, PrimaryButton } from '../Button'
import { useMutation } from '@apollo/react-hooks'
import { StackActions, NavigationActions } from 'react-navigation'
import { MyBackground } from '../MyBackground'
import { Logo } from '../../components/Logo'
import { refreshBackgroundTracking } from '../BackgroundTracking'

export const ApplicationInfo = ({ navigation }) => {
  const [deleteApplication] = useMutation(ApplicationMutation.deleteApplication)
  const application: Application = navigation.state.params.application
  const resetToMainTab = () => {
    let action = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'MainTab',
        }),
      ],
      key: null,
    })
    navigation.dispatch(action)
  }
  const askForAllData = application.permissions.includes('data:*')
  const haveAllData = application.allowPermissions.includes('data:*')
  const allowPermissions = application.allowPermissions
  const customAllow = !allowPermissions || allowPermissions.length === 0
  
  const askForId = application.permissions.includes('data:id') || askForAllData
  const haveIdData =
    (customAllow && askForAllData) ||
    allowPermissions.includes('data:id') || haveAllData
  
  const askForLocation = application.permissions.includes('location:real_time')
  const haveLocationData =
    (customAllow &&
      application.permissions.includes('location:real_time')) ||
    allowPermissions.includes('location:real_time') || haveAllData

  const askForCovid = application.permissions.includes('data:covid') || askForAllData
  const haveCovidData =
    (customAllow && askForAllData) ||
    allowPermissions.includes('data:covid') || haveAllData
  const incompletedForm =
    askForAllData && !haveCovidData

  console.log('allowPermissions', allowPermissions)

  return (
    <MyBackground variant="dark">
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 30 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Icon
                name={'left'}
                type={'antdesign'}
                color={'white'}
                size={20}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{application?.displayName}</Text>
          </View>
          <Text style={styles.subtitle}>ขอสิทธิในการใช้ข้อมูล</Text>
          <ScrollView style={{ flex: 1, paddingVertical: 20 }}>
            <View
              style={{
                width: 150,
                height: 150,
                backgroundColor: COLORS.GRAY_1,
                borderRadius: 75,
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 30,
                overflow: 'hidden',
              }}
            >
              <Logo
                size={application.logo.includes('svg') ? 120 : 150}
                uri={application.logo}
              />
            </View>
            <View style={styles.checkboxContainer}>
              {askForId && (
                <CheckBox
                  title="ต้องการข้อมูลส่วนตัวพื้นฐาน ระบุตัวตน"
                  containerStyle={styles.checkboxItemContainer}
                  textStyle={styles.checkboxLabel}
                  checked={haveIdData}
                  checkedColor={COLORS.ORANGE}
                />
              )}
              {askForLocation && (
                <CheckBox
                  title="ต้องการตำแหน่งที่อยู่"
                  containerStyle={styles.checkboxItemContainer}
                  textStyle={styles.checkboxLabel}
                  checked={haveLocationData}
                  checkedColor={COLORS.ORANGE}
                />
              )}
              {askForLocation && (
                <CheckBox
                  title="ต้องการข้อมูลเรียลไทม์"
                  containerStyle={styles.checkboxItemContainer}
                  textStyle={styles.checkboxLabel}
                  checked={haveLocationData}
                  checkedColor={COLORS.ORANGE}
                />
              )}
              {askForCovid && (
                <CheckBox
                  title="ต้องตอบแบบประเมินความเสี่ยง COVID-19"
                  containerStyle={styles.checkboxItemContainer}
                  textStyle={styles.checkboxLabel}
                  checked={haveCovidData}
                  checkedColor={COLORS.ORANGE}
                />
              )}
            </View>
          </ScrollView>
          {incompletedForm ? (
            <PrimaryButton
              title="กรอกข้อมูลเพิ่มเติม"
              style={{ width: '100%' }}
              onPress={() => {
                resetToMainTab()
                setTimeout(() => {
                  navigation.navigate('AppForm', {
                    applicationId: application.id,
                  })
                }, 0)
              }}
            />
          ) : (
            <PrimaryButton
              title="ดู QR Code"
              style={{ width: '100%' }}
              onPress={() => {
                resetToMainTab()
                navigation.navigate('QRCode', {
                  applicationId: application.id,
                })
              }}
            />
          )}
          <DangerButton
            title="ยกเลิกการแชร์ข้อมูล"
            style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}
            onPress={async () => {
              await deleteApplication({
                variables: {
                  applicationId: application.id,
                },
              })
              await refreshBackgroundTracking()
              Alert.alert(
                'ยกเลิกการแชร์ข้อมูล',
                `ข้อมูลของคุณได้ถูกเลิกแชร์ไปยัง ${application.displayName} แล้ว`,
              )
              resetToMainTab()
            }}
          />
        </View>
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
    flex: 1,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 30,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  checkboxContainer: {
    marginBottom: 40,
    marginLeft: -10,
  },
  checkboxItemContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
  },
  checkboxLabel: {
    color: COLORS.GRAY_1,
    fontFamily: FONT_FAMILY,
    fontWeight: '300',
    fontSize: 16,
  },
})
