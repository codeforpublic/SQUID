import React, { useEffect, useState, useContext } from 'react'
import { MyBackground } from '../../components/MyBackground'
import {
    View,
    StatusBar,
    Platform,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image
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
    navigation.navigate('OnboardBluetooth')
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
        <Icon name="location" color={COLORS.BLUE} size={64} />
        <View style={{ padding: 8, paddingHorizontal: 30 }}>
          <Image
            source={require('../../assets/morchana-permission-location.png')}
            resizeMode="contain"
            style={{ width: 300 }}
          />
          <Text style={styles.title}>ขอสิทธิ์เข้าถึงข้อมูล</Text>
          <Text style={styles.subtitle}>
            เพื่อให้หมอประเมินความเสี่ยงของคุณ
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 30,
          paddingVertical: 30,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View>
            <AntIcon name="checksquareo" size={18} color={COLORS.BLUE} />
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
          <View>
            <AntIcon name="checksquareo" size={18} color={COLORS.BLUE} />
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
    </View>
  )
}
const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: 36,
    textAlign: 'left',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  itemTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  description: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 26,
    textAlign: 'left',
    color: COLORS.BLACK_1,
  },
})
