import React, { useEffect } from 'react'
import { Image, StatusBar, Text, View, SafeAreaView } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../../components/Button'
import { Button } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from '../../styles'
import { doctorSize, styles } from '../2-Onboarding/const'
import { OnboardHeader } from '../2-Onboarding/OnboadHeader'
import I18n from '../../../i18n/i18n';

export const OnboardPhone = () => {
  const navigation = useNavigation()
  const handleSubmit = async () => {
    navigation.navigate('AuthPhone')
  }
  const onBack = navigation.getParam('onBack')

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
              source={require('./onboard-phone.png')}
              resizeMode="contain"
              style={{ height: doctorSize }}
            />
            <Text style={styles.title}>{I18n.t('confirm_phone_no')}</Text>
            <Text style={styles.subtitle}>
              {I18n.t('confirm_phone_no_so_we_can_take_car')}
            </Text>
          </View>

          <PrimaryButton
            containerStyle={{
              width: '100%',
              paddingHorizontal: 30,
              marginTop: 10,
              alignSelf: 'center',
            }}
            title={I18n.t('confirm_now')}
            style={{
              marginTop: 30,
              alignSelf: 'center',
              width: '100%'
            }}
            onPress={() => handleSubmit()}
          />
          <PrimaryButton
            containerStyle={{
              width: '100%',
              paddingHorizontal: 30,
              marginTop: 8,
              marginBottom: 16,
              alignSelf: 'center',
            }}
            title={I18n.t('later')}
            style={{
              alignSelf: 'center',
              width: '100%',
              backgroundColor: COLORS.WHITE,
            }}
            titleStyle={{
              fontFamily: FONT_FAMILY,
              color: COLORS.SECONDARY_NORMAL,
            }}
            onPress={onBack}
          />
        </View>
      </SafeAreaView>
    </>
  )
}
