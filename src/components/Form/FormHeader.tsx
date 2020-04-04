import React, { useState } from 'react'
import { View, Image, StatusBar, StyleSheet } from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'
import { BackButton } from '../BackButton'

interface PropTypes {
  style?: any
  children?: any
  onBack?: any
}

export const FormHeader = ({ style, children, onBack }: PropTypes) => {
  return (
    <View style={style}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <View style={styles.space} />
        <Image source={require('./header-logo.png')} height={50} />
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 30,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },

  space: {
    flex: 1,    
  },
})
