import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import { check, PERMISSIONS, request } from 'react-native-permissions'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { backgroundTracking } from '../../services/background-tracking'
import { COLORS } from '../../styles'
import { isSmallDevice } from '../../utils/responsive'
import { doctorSize, styles } from './const'
import { OnboardHeader } from './OnboadHeader'
import { normalize } from 'react-native-elements'

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
        <ActivityIndicator size="large" />
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
        <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
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
              resizeMode="contain"
              style={{ height: doctorSize }}
            />
            <Text style={styles.title}>ขอสิทธิ์เข้าถึงข้อมูล</Text>
            <Text style={styles.subtitle}>
              เพื่อให้หมอประเมินความเสี่ยงของคุณ
            </Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-location-icon.png')}
                resizeMode="contain"
                style={{ width: normalize(40) }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>ตำแหน่งของคุณ</Text>
              <Text style={styles.description}>
                เพื่อคอยแจ้งเตือนหากคุณได้ไปใกล้ชิดกับคนที่มี ความเสี่ยง
                หรืออยู่ในพื้นที่เสี่ยง
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 16 }}>
              <Image
                source={require('../../assets/perm-motion-icon.png')}
                resizeMode="contain"
                style={{ width: normalize(40) }}
              />
            </View>

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
      </SafeAreaView>
    </>
  )
}
