import React, { useState } from 'react'
import { View, Image, StatusBar, StyleSheet, Dimensions } from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'
import { BackButton } from '../BackButton'

interface PropTypes {
  style?: any
  children?: any
  onBack?: any
  backIcon?: string
}

export const FormHeader = ({
  style,
  children,
  onBack,
  backIcon,
}: PropTypes) => {
  const logoHeight = Dimensions.get('window').height < 600 ? 40 : 60
  const logoWidth = (logoHeight * 101) / 54
  return (
    <View style={style}>
      <View style={styles.header}>
        <BackButton onPress={onBack} backIcon={backIcon} />
        <View style={styles.space} />
        <Image
          source={require('./form-logo.png')}
          style={{ height: logoHeight, width: logoWidth }}
          resizeMode="contain"
        />
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },

  space: {
    flex: 1,
  },
})
