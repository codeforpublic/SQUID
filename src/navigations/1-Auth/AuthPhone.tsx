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

export const AuthPhone = () => {
  const navigation = useNavigation()
  const { showSpinner, hide } = useHUD()
  const [phone, setPhone] = useState('')
  const isValidPhone = useMemo(() => phone.match(/^[0-9-]{12}$/), [phone])
  const resetTo = useResetTo()

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}>
        <StatusBar
          backgroundColor={COLORS.WHITE}
          barStyle="dark-content"
        />
        <FormHeader>        
          <View style={styles.header}>
            <Text style={styles.title}>กรอกเบอร์โทรศัพท์</Text>
            <Text style={styles.subtitle}>เพื่อยืนยันตัวตนด้วย SMS</Text>
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
              justifyContent: 'center'
            }}
          >
            <TextInputMask
              type="custom"
              options={{
                mask: "999-999-9999"
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
            onPress={async () => {
              showSpinner()
              try {
                await requestOTP(phone.replace(/-/g, ""))
                hide()
                navigation.navigate({
                  routeName: 'AuthOTP',
                  params: { phone: phone.replace(/-/g, "") },
                })
              } catch (err) {
                console.log(err)
                Alert.alert('เกิดข้อผิดพลาด')
                hide()
              }
            }}
          />
          {/* <TouchableOpacity onPress={() => {
            applicationState.setData('skipRegistration', true)
            if (applicationState.getData('isPassedOnboarding')) {
              resetTo({ routeName: 'MainApp' })
            } else {              
              navigation.navigate({
                routeName: 'Onboarding',
                params: { phone },
              })
            }
          }} style={{ marginTop: 8 }}>
            <Link style={{ fontWeight: 'bold' }}>
              ใช้งานแบบไม่ยืนยันตัวตน >
            </Link>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    padding: 16,
  },
  agreement: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.BLACK_1,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
