import React from 'react'
import { View } from 'react-native'
import { COLORS } from '../styles'

export const WhiteBackground = ({ children }) => {
  return <View style={{ backgroundColor: COLORS.WHITE, flex: 1 }}>{children}</View>
}
