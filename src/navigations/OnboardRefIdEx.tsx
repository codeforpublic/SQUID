import React from 'react'
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native'
import { normalize } from 'react-native-elements'
import I18n from 'i18n-js'
import { COLORS, FONT_BOLD, FONT_SIZES } from '../styles'
import { WhiteBackground } from '../components/WhiteBackground'
import { PageBackButton } from './2-Onboarding/components/PageBackButton'
const padding = normalize(16)

export const OnboardRefIdEx = () => {
  return (
    <WhiteBackground>
      <PageBackButton label={I18n.t('personal_information')} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{I18n.t('coe_prepare_reference_id')}</Text>
        <Text style={styles.content}>{I18n.t('coe_reference_id_exam')}</Text>
        <Image style={styles.imageStyle} source={require('./refIdExam.png')} />
      </View>
    </WhiteBackground>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
    color: COLORS.BLUE_BUTTON,
  },
  content: {
    fontSize: FONT_SIZES[400],
    color: COLORS.BLUE_BUTTON,
  },
  contentContainer: {
    padding,
  },
  imageStyle: {
    marginVertical: 32,
    width: Dimensions.get('window').width - 36,
  },
})
