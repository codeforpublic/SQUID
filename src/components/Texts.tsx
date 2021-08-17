import React from 'react'
import { Text, StyleSheet, TextProps } from 'react-native'
import { FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../styles'

const Normal: React.FC<TextProps> = ({ children, style, ...rest }) => {
  return (
    <Text style={style ? [styles.defaultText, style] : styles.defaultText} {...rest}>
      {children}
    </Text>
  )
}

const Bold: React.FC<TextProps> = ({ children, style, ...rest }) => {
  return (
    <Text style={style ? [styles.boldText, style] : styles.defaultText} {...rest}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: FONT_FAMILY,
    fontWeight: 'normal',
    fontSize: FONT_SIZES[500],
  },
  boldText: {
    fontFamily: FONT_BOLD,
    fontWeight: '700',
    fontSize: FONT_SIZES[600],
  },
})

export default {
  Normal,
  Bold,
}
