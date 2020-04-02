import React, { useEffect, useState, useContext } from 'react'
import { MyBackground } from '../../components/MyBackground'
import {
  View,
  StatusBar,
  Platform,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { PERMISSIONS, check, request } from 'react-native-permissions'
import { useNavigation } from 'react-navigation-hooks'
import { FONT_FAMILY, COLORS } from '../../styles'
import { PrimaryButton } from '../../components/Button'
import Icon from 'react-native-vector-icons/Entypo'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useHUD } from '../../HudView'
import { StackActions, NavigationActions } from 'react-navigation'
import { backgroundTracking } from '../../services/background-tracking'

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
    navigation.navigate('OnboardProgressing')
  }
  if (locationPerm === 'checking' || activityPerm === 'checking') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.PRIMARY_DARK,
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
        backgroundColor: COLORS.PRIMARY_DARK,
      }}
    >
      <StatusBar
        backgroundColor={COLORS.PRIMARY_DARK}
        barStyle="light-content"
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="location" color={COLORS.ORANGE} size={64} />
        <View style={{ padding: 8 }}>
          <Text style={styles.title}>ขอสิทธิ์เข้าถึงข้อมูล</Text>
          <Text style={styles.description}>
            <AntIcon name="checksquareo" size={18} color={COLORS.ORANGE} /> 1.
            เราจำเป็นจะต้องเข้าถึงที่อยู่ของคุณ
            เพื่อส่งให้กับหน่วยงานที่คุณสามารถวางใจได้
            โดยที่คุณสามารถยกเลิกการแชร์ข้อมูลได้ตลอดเวลา
          </Text>
          <Text style={styles.description}>
            <AntIcon name="checksquareo" size={18} color={COLORS.ORANGE} /> 2.
            เราจำเป็นจะต้องเข้าถึงกิจกรรมการใช้งานของโทรศัพท์มือถือของท่าน
            เพื่อจัดการการใช้พลังงานของมือถืออย่างมีประสิทธิภาพ
          </Text>
          <PrimaryButton
            title={'อนุญาตให้เข้าถึง'}
            style={{ marginTop: 56, alignSelf: 'center', width: '100%' }}
            onPress={() => handleSubmit()}
          />
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  title: {
    marginTop: 40,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 29,
    lineHeight: 44,
    textAlign: 'left',
    color: COLORS.WHITE,
    width: 310,
  },
  description: {
    marginTop: 20,
    width: 310,
    marginBottom: 20,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 26,
    textAlign: 'left',
    color: COLORS.WHITE,
  },
})
