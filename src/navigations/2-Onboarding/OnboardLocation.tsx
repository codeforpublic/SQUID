import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, SafeAreaView, StatusBar, Text, View } from 'react-native'
import { check, PERMISSIONS, request } from 'react-native-permissions'
import { useNavigation } from '@react-navigation/native'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { backgroundTracking } from '../../services/background-tracking'
import { COLORS } from '../../styles'
import { isSmallDevice } from '../../utils/responsive'
import { doctorSize, styles } from './const'
import { OnboardHeader } from './OnboadHeader'
import { normalize } from 'react-native-elements'

import I18n from '../../../i18n/i18n'

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
})

const ACTIVITY_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.MOTION, // NOT SURE
  android: PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
})

export const OnboardLocation = () => {
  const navigation = useNavigation()

  const [locationPerm, setLocationPerm] = useState('checking')
  const [activityPerm, setActivityPerm] = useState('checking')

  const { showSpinner, hide } = useHUD()

  const checkPerms = async () => {
    const perms = await Promise.all([check(LOCATION_PERMISSION), check(ACTIVITY_PERMISSION)])
    if (perms[0] === 'granted' && perms[1] === 'granted') {
      await backgroundTracking.start()
      navigation.navigate('OnboardProgressing')
    } else {
      setLocationPerm(perms[0])
      setActivityPerm(perms[1])
    }
  }

  useEffect(() => {
    checkPerms()
  }, [])

  const handleSubmit = async () => {
    showSpinner()

    await request(LOCATION_PERMISSION)
    await request(ACTIVITY_PERMISSION)

    hide()

    backgroundTracking.start()

    setTimeout(() => {
      navigation.navigate('OnboardBluetooth')
    }, 1000)
  }
  if (locationPerm === 'checking' || activityPerm === 'checking') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size='large' />
      </View>
    )
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
          // paddingHorizontal: 20
        }}
      >
        <StatusBar backgroundColor={COLORS.WHITE} barStyle='dark-content' />
        <OnboardHeader
          style={{
            backgroundColor: COLORS.BLUE,
          }}
        />
        <View style={styles.topContainer}>
          <View
            style={{
              padding: 8,
              paddingHorizontal: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/morchana-permission-location.png')}
              resizeMode='contain'
              style={{ height: doctorSize }}
            />
            <Text style={I18n.currentLocale() == 'en' ? styles.titleEN : styles.title}>
              {I18n.t('pls_grant_permission')}
            </Text>
            <Text style={styles.subtitle}>{I18n.t('let_doc_estimate_your_risk')}</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-location-icon.png')}
                resizeMode='contain'
                style={{ width: normalize(40) }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{I18n.t('your_position')}</Text>
              <Text style={styles.description}>{I18n.t('help_notify_if_you_get_near_risky_person_or_area')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-motion-icon.png')}
                resizeMode='contain'
                style={{ width: normalize(40) }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{I18n.t('your_motion')}</Text>
              <Text style={styles.description}>{I18n.t('to_manage_mobile_energy_efficiently')}</Text>
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
