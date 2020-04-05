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
        <Image source={require('./form-logo.png')} style={{ height: 60}} resizeMode="contain" />
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
