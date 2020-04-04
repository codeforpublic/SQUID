import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Button as RButton } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from '../styles'

interface PropTypes {
  title: string
  style?: Object
  onPress: (e: any) => any
  disabled?: boolean
  icon?: any
  iconRight?: boolean
}

export const PrimaryButton = ({
  onPress,
  title,
  style = {},
  disabled,
  ...props
}: PropTypes) => {
  return (
    <RButton
      buttonStyle={{
        backgroundColor: disabled ? '#555' : COLORS.BLUE,
        borderRadius: 6,
        // height: 60,
        width: 240,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      title={title}
      titleStyle={{
        fontFamily: FONT_FAMILY,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        color: COLORS.PRIMARY_LIGHT,
      }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

export const DangerButton = ({
  onPress,
  title,
  style = {},
  disabled,
  ...props
}: PropTypes) => {
  return (
    <RButton
      buttonStyle={{
        backgroundColor: disabled ? '#555' : COLORS.DANGER,
        borderRadius: 6,
        // height: 60,
        width: 240,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      title={title}
      titleStyle={{
        fontFamily: FONT_FAMILY,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        color: COLORS.PRIMARY_LIGHT,
      }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

export const RectButton = ({
  onPress,
  title,
  style = {},
  disabled,
  ...props
}: PropTypes) => {
  return (
    <RButton
      buttonStyle={{
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
        // height: 60,
        width: 240,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      title={title}
      titleStyle={{
        color: 'black',
        fontFamily: FONT_FAMILY,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
      }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}
