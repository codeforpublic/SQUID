import React, { useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native'
import { normalize } from 'react-native-elements'
import I18n from 'i18n-js'
import { COLORS, FONT_BOLD, FONT_SIZES, FONT_MED } from '../../styles'
import { applicationState } from '../../state/app-state'
import { PrimaryButton } from '../../components/Button'
import { useResetTo } from '../../utils/navigation'
import { userPrivateData } from '../../state/userPrivateData'

const padding = normalize(16)

export const OnboardCoeLanding = () => {
  const faceURI = userPrivateData.getFace()
  const resetTo = useResetTo()

  const onFinishLanding = () => {
    applicationState.setData('isPassedOnboarding', true)
    resetTo({ name: 'MainApp' })
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: faceURI }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
          />
        </View>
        <Text style={styles.title}>{I18n.t('landing_welcome_title')}</Text>
        <Text style={styles.content}>{I18n.t('landing_welcome_text')}</Text>
        <Text style={styles.detailText}>{I18n.t('landing_enjoy')}</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={I18n.t('start')}
          titleStyle={{
            color: COLORS.DARK_BLUE,
            width: 240,
          }}
          buttonStyle={{
            backgroundColor: 'white',
          }}
          containerStyle={styles.fullWidth}
          onPress={onFinishLanding}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[700],
    color: COLORS.WHITE,
  },
  imageContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  content: {
    marginTop: 16,
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_MED,
    color: COLORS.WHITE,
    lineHeight: 30,
  },
  detailText: {
    marginTop: 24,
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_MED,
    color: COLORS.WHITE,
  },
  container: {
    backgroundColor: COLORS.DARK_BLUE,
    height: Dimensions.get('window').height,
    padding: padding,
  },
  contentContainer: {
    paddingVertical: padding,
  },
  imageStyle: {
    marginVertical: 32,
    width: Dimensions.get('window').width - 36,
  },
  footer: {
    position: 'absolute',
    bottom: (Dimensions.get('window').height * 10) / 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
})
