import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { check, PERMISSIONS, request } from 'react-native-permissions'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { backgroundTracking } from '../../services/background-tracking'
import { COLORS, FONT_FAMILY } from '../../styles'
import { isSmallDevice } from '../../utils/responsive'
import { doctorSize,styles } from './const'

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
    const perms = await Promise.all([
      check(LOCATION_PERMISSION),
      check(ACTIVITY_PERMISSION),
    ])
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
    navigation.navigate('OnboardBluetooth')}
    ,1000)
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
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        // paddingHorizontal: 20
      }}
    >
      <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
      <View
        style={{
          flex: 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.BLUE,
        }}
      >
        <View style={{ padding: 8, paddingHorizontal: 30,alignItems: 'center'}}>
          <Image
            source={require('../../assets/morchana-permission-location.png')}
            resizeMode="contain"
            style={{ width: doctorSize }}
          />
          <Text style={styles.title}>ขอสิทธิ์เข้าถึงข้อมูล</Text>
          <Text style={styles.subtitle}>
            เพื่อให้หมอประเมินความเสี่ยงของคุณ
          </Text>
        </View>
      </View>
      <View
        style={{
          flex:3,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 30,
          paddingVertical: 30,
          flexBasis: 180,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {!isSmallDevice && (
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-location-icon.png')}
                resizeMode="contain"
                style={{ width: 52 }}
              />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>ตำแหน่งของคุณ</Text>
            <Text style={styles.description}>
              เพื่อคอยแจ้งเตือนหากคุณได้ไปใกล้ชิดกับคนที่มี ความเสี่ยง
              หรืออยู่ในพื้นที่เสี่ยง
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {!isSmallDevice && (
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-motion-icon.png')}
                resizeMode="contain"
                style={{ width: 52 }}
              />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>การเคลื่อนที่ของคุณ (MOTION)</Text>
            <Text style={styles.description}>
              เพื่อจัดการการใช้พลังงานของมือถือ อย่างมีประสิทธิภาพ
            </Text>
          </View>
        </View>
        <PrimaryButton
          containerStyle={{ width: '100%' }}
          title={'อนุญาตให้เข้าถึง'}
          style={{
            marginTop: 30,
            alignSelf: 'center',
            width: '100%',
            backgroundColor: COLORS.BLUE_BUTTON,
          }}
          onPress={() => handleSubmit()}
        />
      </View>
    </View>
  )
}