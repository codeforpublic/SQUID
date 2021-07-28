import React from 'react'
import { Image, SafeAreaView, StatusBar, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { useContactTracer } from '../../services/contact-tracing-provider'
import { COLORS } from '../../styles'
import { doctorSize, styles } from './const'
import { OnboardHeader } from './OnboadHeader'
import { normalize } from 'react-native-elements'

import I18n from '../../../i18n/i18n'

export const OnboardBluetooth = () => {
  const navigation = useNavigation()
  const contactTracer = useContactTracer()

  const { showSpinner, hide } = useHUD()

  const handleSubmit = async () => {
    showSpinner()
    await contactTracer?.enable()
    hide()

    setTimeout(() => {
      navigation.navigate('OnboardNotification')
    }, 1000)
  }

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BLUE,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
        }}
      >
        <StatusBar backgroundColor={COLORS.WHITE} barStyle='dark-content' />
        <OnboardHeader
          style={{
            backgroundColor: COLORS.BLUE,
          }}
        />
        <View style={styles.topContainer}>
          <View style={{ padding: 8, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../assets/morchana-permission-bluetooth.png')}
              resizeMode='contain'
              style={{ height: doctorSize }}
            />
            <Text style={I18n.currentLocale() == 'en' ? styles.titleEN : styles.title}>
              {I18n.t('risky_ppl_nearby')}
            </Text>
            <Text style={styles.subtitle}>{I18n.t('app_can_check_with_bluetooth')}</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-bluetooth-icon.png')}
                resizeMode='contain'
                style={{ width: normalize(40) }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{I18n.t('pls_grant_bluetooth_access')}</Text>
              <Text style={styles.description}>{I18n.t('consume_low_energy_and_can_detect_closed_contact')}</Text>
            </View>
          </View>
          <PrimaryButton
            containerStyle={{ width: '100%' }}
            title={I18n.t('grant_permission')}
            style={{
              marginTop: 30,
              alignSelf: 'center',
              width: '100%',
              backgroundColor: COLORS.BLUE_BUTTON,
            }}
            onPress={() => handleSubmit()}
          />
        </View>
      </SafeAreaView>
    </>
  )
}
