import React, { useEffect } from 'react'
import { Image, StatusBar, Text, View, SafeAreaView } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { useHUD } from '../../HudView'
import { pushNotification } from '../../services/notification'
import { COLORS } from '../../styles'
import { doctorSize, styles } from './const'
import { OnboardHeader } from './OnboadHeader'

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

    pushNotification.requestPermissions()
    hide()

    navigation.navigate('OnboardProgressing')
  }

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.BLUE,
          // paddingHorizontal: 20
        }}
      >
        <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
        <OnboardHeader
          style={{
            backgroundColor: COLORS.BLUE,
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.BLUE,
          }}
        >
          <View
            style={{
              padding: 8,
              paddingHorizontal: 30,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/morchana-permission-notification.png')}
              resizeMode="contain"
              style={{ height: doctorSize }}
            />
            <Text style={styles.title}>ให้หมอแจ้งเตือนคุณ</Text>
            <Text style={styles.subtitle}>
              เมื่อคุณอยู่ใกล้ชิดกับคนที่มีความเสี่ยง
            </Text>
          </View>

          <PrimaryButton
            containerStyle={{
              width: '100%',
              padding: 30,
              alignSelf: 'center'
            }}
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
      </SafeAreaView>
    </>
  )
}
