import React from 'react'
import { Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { useContactTracer } from '../../services/contact-tracing-provider'
import { COLORS, FONT_FAMILY } from '../../styles'
import { isSmallDevice } from '../../utils/responsive'
import { doctorSize, styles } from './const'

export const OnboardBluetooth = () => {
  const navigation = useNavigation()
  const contactTracer = useContactTracer()

  const { showSpinner, hide } = useHUD()


  const handleSubmit = async () => {
    showSpinner()
    await contactTracer?.enable()
    hide()

    setTimeout(() => {
    navigation.navigate('OnboardNotification')},1000)
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
            source={require('../../assets/morchana-permission-bluetooth.png')}
            resizeMode="contain"
            style={{ width: doctorSize }}
          />
          <Text style={styles.title}>มีคนเสี่ยงอยู่ใกล้ ๆ</Text>
          <Text style={styles.subtitle}>หมอตรวจสอบได้ด้วยบลูทูธ</Text>
        </View>
      </View>
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 30,
          paddingVertical:30,
          flexBasis: 180,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {!isSmallDevice &&<View style={{ paddingRight: 16 }}>
            <Image
              source={require('../../assets/perm-bluetooth-icon.png')}
              resizeMode="contain"
              style={{ width: 52 }}
            />
          </View>}
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>ขอสิทธ์เข้าถึงบลูทูธ Bluetooth</Text>
            <Text style={styles.description}>
              ใช้พลังงานต่ำ เพื่อคอยสแกนคนใกล้ตัวและแจ้งเตือนทันทีหากคุณได้ไปใกล้ชิดกับคนที่มีความเสี่ยง
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