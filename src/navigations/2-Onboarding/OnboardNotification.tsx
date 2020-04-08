import React, { useEffect } from 'react'
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { backgroundTracking } from '../../services/background-tracking'
import { pushNotification } from '../../services/notification'
import { COLORS, FONT_FAMILY } from '../../styles'

export const OnboardNotification = () => {
  const navigation = useNavigation()

  const { showSpinner, hide } = useHUD()

  const checkPerms = async () => {
    if (pushNotification.isConfigured) {
      navigation.navigate('OnboardProgressing')
    }
  }

  useEffect(() => {
    checkPerms()
  }, [])

  const handleSubmit = async () => {
    showSpinner()

    pushNotification.configure()
    hide()

    navigation.navigate('OnboardProgressing')
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
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.BLUE,
        }}
      >
        <Icon name="location" color={COLORS.BLUE} size={64} />
        <View style={{ padding: 8, paddingHorizontal: 30 }}>
          <Image
            source={require('../../assets/morchana-permission-notification.png')}
            resizeMode="contain"
            style={{ width: 300 }}
          />
          <Text style={styles.title}>ให้หมอแจ้งเตือนคุณ</Text>
          <Text style={styles.subtitle}>
            เมื่อคุณอยู่ใกล้ชิดกับคนที่มีความเสี่ยง
          </Text>
        </View>

        <PrimaryButton
          containerStyle={{ width: '100%', padding: 30 }}
          title={'เปิดการแจ้งเตือน'}
          style={{
            marginTop: 30,
            alignSelf: 'center',
            width: '100%',
            backgroundColor: COLORS.WHITE,
          }}
          titleStyle={{
            color: COLORS.SECONDARY_NORMAL,
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
