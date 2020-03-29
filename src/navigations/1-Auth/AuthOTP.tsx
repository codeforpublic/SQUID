import React, { useState, useEffect } from 'react'
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
import { applicationState } from '../../state/app-state'
import OTPInputView from '@twotalltotems/react-native-otp-input'


export const AuthOTP = () => {
  const { showSpinner, hide } = useHUD()
  const navigation = useNavigation()
  const phone = navigation.getParam('phone')
  const [otp, setOtp] = useState('')
  const resetTo = useResetTo()
  const onSubmit = async () => {
    showSpinner()
    try {
      const bool = await verifyOTP(otp)
      if (!bool) {
        Alert.alert('รหัสผ่านไม่ถูกต้อง')
        hide()
        return
      }      
      hide()
      applicationState.set('isRegistered', 'success')
      resetTo({ routeName: 'Onboarding' })
    } catch (err) {
      console.log(err)
      hide()
      Alert.alert('เกิดข้อผิดพลาด')
    }    
  }
  useEffect(() => {
    if (otp.length === 4)  {
      onSubmit()
    }
  }, [otp])

  return (
    
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}>
          <StatusBar backgroundColor={COLORS.PRIMARY_DARK} barStyle="light-content" />
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
              <OTPInputView
                keyboardType={'phone-pad'}
                codeInputFieldStyle={{
                  backgroundColor: COLORS.WHITE,
                  borderRadius: 4,
                  borderColor: COLORS.GRAY_2,
                  borderWidth: 1,
                  fontSize: 24,
                  fontFamily: FONT_FAMILY,
                  color: COLORS.PRIMARY_DARK,
                  margin: 4,
                  height: 60,
                  width: 60
                }}
                style={{ height: 60 }}
                onCodeFilled={code => setOtp(code)}
                pinCount={4}
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
              <AntIcon name="reload1" size={24} color={COLORS.WHITE} />
              <Text style={styles.text}>ส่งรหัสใหม่</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <PrimaryButton
              disabled={otp.length !== 4}
              title={'ถัดไป'}
              onPress={onSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.PRIMARY_DARK },
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
    color: COLORS.WHITE,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.WHITE,
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
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
