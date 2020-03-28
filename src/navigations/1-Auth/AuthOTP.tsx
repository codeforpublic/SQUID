import React, { useState } from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'
import { PrimaryButton } from '../../components/Button'
import OtpInputs from 'react-native-otp-inputs'
import AntIcon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-community/async-storage'
import { BackButton } from '../../components/BackButton'
import { requestOTP, verifyOTP } from '../../api'
import { useHUD } from '../../HudView'
import { useResetTo } from '../../utils/navigation'
import { applicationState } from '../../app-state'

export const AuthOTP = () => {
  const { showSpinner, hide } = useHUD()
  const navigation = useNavigation()
  const phone = navigation.getParam('phone')
  const [otp, setOtp] = useState('')
  const resetTo = useResetTo()

  return (
    <MyBackground variant="light">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}>
          <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
          <View style={{ padding: 16 }}>
            <BackButton />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>กรอกรหัสจาก SMS</Text>
            <Text style={styles.subtitle}>
              ส่งไปที่เบอร์ {navigation.state.params.phone}
            </Text>
          </View>
          <View style={styles.content}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: 280,
                maxWidth: '100%',
              }}
            >
              <OtpInputs
                keyboardType={'phone-pad'}
                inputContainerStyles={{
                  backgroundColor: COLORS.WHITE,
                  borderRadius: 4,
                  borderColor: COLORS.GRAY_2,
                  borderWidth: 1,
                  flex: 1,
                  margin: 4,
                  height: 60,
                  justifyContent: 'center',
                }}
                inputStyles={{ textAlign: 'center', fontSize: 32 }}
                handleChange={code => setOtp(code)}
                numberOfInputs={4}
              />
            </View>
            <TouchableOpacity
              onPress={async () => {
                showSpinner()
                try {
                  await requestOTP(phone)
                  hide()
                } catch (err) {
                  Alert.alert('เกิดข้อผิดพลาด')
                  hide()
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 32,
              }}
            >
              <AntIcon name="reload1" size={24} color={COLORS.PRIMARY_DARK} />
              <Text style={styles.text}>ส่งรหัสใหม่</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <PrimaryButton
              disabled={otp.length !== 4}
              title={'ถัดไป'}
              onPress={async () => {
                showSpinner()
                try {
                  await verifyOTP(otp)
                  await new Promise((resolve, reject) =>
                    setTimeout(resolve, 300),
                  )
                } catch (err) {
                  // todo
                  console.log(err)
                }
                hide()
                applicationState.set('isRegistered', 'success')
                resetTo({ routeName: 'Onboarding' })
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  text: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 32,
    marginLeft: 8,
    color: COLORS.PRIMARY_DARK,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_DARK,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.RED,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  agreement: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.PRIMARY_DARK,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
