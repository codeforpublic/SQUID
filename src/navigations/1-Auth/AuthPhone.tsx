import React, { useState, useMemo } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useNavigation } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { PrimaryButton } from '../../components/Button'
import { BackButton } from '../../components/BackButton'
import { requestOTP } from '../../api'
import { useHUD } from '../../HudView'
import { Link } from '../../components/Base'
import { applicationState } from '../../state/app-state'
import { useResetTo } from '../../utils/navigation'
import { FormHeader } from '../../components/Form/FormHeader'
import { userPrivateData } from '../../state/userPrivateData'

export const AuthPhone = () => {
  const navigation = useNavigation()
  const { showSpinner, hide } = useHUD()
  const [phone, setPhone] = useState(userPrivateData.getMobileNumber() || '')
  const isValidPhone = useMemo(
    () => phone.replace(/-/g, '').match(/^[0-9]{10}$/),
    [phone],
  )
  const resetTo = useResetTo()
  const onBack = navigation.getParam('onBack')
  const backIcon = navigation.getParam('backIcon')

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}>
        <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
        <FormHeader onBack={onBack} backIcon={backIcon}>
          <View style={styles.header}>
            <Text style={styles.title}>กรอกเบอร์โทรศัพท์</Text>
            <Text style={styles.subtitle}>เพื่อยืนยันรหัสผ่านจาก SMS</Text>
          </View>
        </FormHeader>
        <View style={styles.content}>
          <View
            style={{
              backgroundColor: COLORS.WHITE,
              borderWidth: 1,
              borderColor: COLORS.GRAY_2,
              borderRadius: 4,
              height: 60,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <TextInputMask
              type="custom"
              options={{
                mask: '999-999-9999',
              }}
              onChangeText={text => {
                setPhone(text.trim())
              }}
              value={phone}
              autoFocus
              placeholder="เบอร์โทรศัพท์ของคุณ"
              maxLength={12}
              keyboardType={'phone-pad'}
              style={{
                textAlign: 'center',
                fontSize: 18,
                fontFamily: FONT_FAMILY,
                letterSpacing: 3,
              }}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            disabled={!isValidPhone}
            title={'ถัดไป'}
            style={{ width: '100%' }}
            containerStyle={{ width: '100%' }}
            onPress={async () => {
              showSpinner()
              try {
                await requestOTP(phone.replace(/-/g, ''))
                hide()
                userPrivateData.setData('mobileNumber', phone)
                navigation.navigate({
                  routeName: 'AuthOTP',
                  params: { phone: phone.replace(/-/g, '') },
                })
              } catch (err) {
                console.log(err)
                Alert.alert('เกิดข้อผิดพลาด')
                hide()
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              applicationState.setData('skipRegistration', true)
              if (applicationState.getData('isPassedOnboarding')) {
                resetTo({ routeName: 'MainApp' })
              } else {
                navigation.navigate({
                  routeName: 'Onboarding',
                  params: { phone },
                })
              }
            }}
            style={{ marginTop: 8 }}
          >
            <Link style={{ color: '#576675', textDecorationLine: 'underline' }}>
              ใช้งานแบบไม่ยืนยันตัวตน
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  header: {
    alignItems: 'flex-start',
    marginBottom: 32,
    marginHorizontal: 24,
  },

  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.RED,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.LIGHT_BLUE,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.BORDER_LIGHT_BLUE,
  },
  agreement: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.BLACK_1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
})
