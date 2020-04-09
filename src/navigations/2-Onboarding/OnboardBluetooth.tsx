import React from 'react'
import { Image, SafeAreaView, StatusBar, Text, View } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { useContactTracer } from '../../services/contact-tracing-provider'
import { COLORS } from '../../styles'
import { isSmallDevice } from '../../utils/responsive'
import { doctorSize, styles } from './const'
import { OnboardHeader } from './OnboadHeader'
import { normalize } from 'react-native-elements'

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

  return ( <>
    <SafeAreaView style={{
        backgroundColor: COLORS.BLUE,
      }}/>
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
        }}/>
      <View
        style={styles.topContainer}
      >
        <View style={{ padding: 8, paddingHorizontal: 30,  justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/morchana-permission-bluetooth.png')}
            resizeMode="contain"
            style={{ height: doctorSize }}
          />
          <Text style={styles.title}>มีคนเสี่ยงอยู่ใกล้ ๆ</Text>
          <Text style={styles.subtitle}>หมอตรวจสอบได้ด้วยบลูทูธ</Text>
        </View>
      </View>
      <View
        style={styles.bottomContainer}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingRight: 16 }}>
            <Image
              source={require('../../assets/perm-bluetooth-icon.png')}
              resizeMode="contain"
              style={{ width: normalize(40) }}
            />
          </View>
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
    </SafeAreaView>
    </>
  )
}