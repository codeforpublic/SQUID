import React from 'react'
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native'
import { normalize } from 'react-native-elements'
import { PageBackButton } from './OnboardEnterQuestion'
import I18n from 'i18n-js'
import { COLORS, FONT_BOLD, FONT_SIZES } from '../../styles'

const padding = normalize(16)

export const OnboardRefIdEx = () => {
  return (
    <View style={styles.container}>
      <PageBackButton label={I18n.t('personal_information')} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{I18n.t('coe_prepare_reference_id')}</Text>
        <Text style={styles.content}>{I18n.t('coe_reference_id_exam')}</Text>
        <Image style={styles.imageStyle} source={require('./refIdExam.png')} />
      </View>
    </View>
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
  container: {
    backgroundColor: '#fff',
    padding,
    height: '100%',
  },
  contentContainer: {
    paddingVertical: padding,
  },
  imageStyle: {
    marginVertical: 32,
    width: Dimensions.get('window').width - 36,
  },
})
