import { useNavigation } from '@react-navigation/native'
import React, { useMemo, useState } from 'react'
import { Alert, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { SafeAreaView } from 'react-native-safe-area-context'
import I18n from '../../../i18n/i18n'
import { requestOTP } from '../../api'
import { Link } from '../../components/Base'
import { PrimaryButton } from '../../components/Button'
import { FormHeader } from '../../components/Form/FormHeader'
import { useHUD } from '../../HudView'
import { applicationState } from '../../state/app-state'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { useResetTo } from '../../utils/navigation'

export const AuthPhone = ({ route }) => {
  const navigation = useNavigation()
  const { showSpinner, hide } = useHUD()
  const [phone, setPhone] = useState('')
  const isValidPhone = useMemo(() => phone.replace(/-/g, '').match(/^(0|1)[0-9]{9}$/), [phone])
  const resetTo = useResetTo()
  const onBack = route.params.onBack
  const backIcon = route.params.backIcon

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}>
        <StatusBar backgroundColor={COLORS.WHITE} barStyle='dark-content' />
        <FormHeader onBack={onBack} backIcon={backIcon}>
          <View style={styles.header}>
            <Text style={styles.title}>{I18n.t('pls_input_phone_no')}</Text>
            <Text style={styles.subtitle}>{I18n.t('confirm_otp_from_sms')}</Text>
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
              type='custom'
              options={{
                mask: '999-999-9999',
              }}
              onChangeText={(text) => {
                setPhone(text.trim())
              }}
              value={phone}
              autoFocus
              placeholder={I18n.t('your_phone_no')}
              maxLength={12}
              keyboardType={'phone-pad'}
              style={{
                textAlign: 'center',
                fontSize: FONT_SIZES[600],
                fontFamily: FONT_FAMILY,
                letterSpacing: 2,
              }}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            disabled={!isValidPhone}
            title={I18n.t('next')}
            style={{ width: '100%' }}
            containerStyle={{ width: '100%' }}
            onPress={async () => {
              showSpinner()
              const mobileNumber = phone.replace(/-/g, '')
              try {
                await requestOTP(mobileNumber)
                hide()
                navigation.navigate({
                  name: 'AuthOTP',
                  params: { phone: mobileNumber },
                })
              } catch (err) {
                console.log(err)
                Alert.alert(I18n.t('error'))
                hide()
              }
            }}
          />
          <TouchableOpacity
            onPress={() => {
              applicationState.setData('skipRegistration', true)
              if (applicationState.getData('isPassedOnboarding')) {
                resetTo({ name: 'MainApp' })
              } else {
                navigation.navigate({
                  name: 'Onboarding',
                  params: { phone },
                })
              }
            }}
            style={{ marginTop: 8 }}
          >
            <Link style={{ fontSize: FONT_SIZES[500], color: '#576675', textDecorationLine: 'underline' }}>
              {I18n.t('use_without_iden_confirm')}
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
    marginBottom: 16,
    marginHorizontal: 24,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[700],
    alignItems: 'center',
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.SECONDARY_DIM,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.RED,
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
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
})
