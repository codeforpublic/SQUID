import React from 'react'
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { PERMISSIONS } from 'react-native-permissions'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/Entypo'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { useContactTracer } from '../../services/contact-tracing-provider'
import { COLORS, FONT_FAMILY } from '../../styles'

export const OnboardBluetooth = () => {
  const navigation = useNavigation()
  const contactTracer = useContactTracer()

  const { showSpinner, hide } = useHUD()


  const handleSubmit = async () => {
    showSpinner()
    await contactTracer?.enable()
    hide()

    navigation.navigate('OnboardNotification')
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
        <View style={{ padding: 8, paddingHorizontal: 30 }}>
          <Image
            source={require('../../assets/morchana-permission-bluetooth.png')}
            resizeMode="contain"
            style={{ width: 300 }}
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
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingRight: 16 }}>
            <Image
              source={require('../../assets/perm-bluetooth-icon.png')}
              resizeMode="contain"
              style={{ width: 52 }}
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
