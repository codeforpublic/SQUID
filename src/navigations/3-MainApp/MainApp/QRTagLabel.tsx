import React from 'react'
import { FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { View, Text } from 'react-native'
import { SelfQR } from '../../../state/qr'

export const QRTagLabel = ({ qr }: { qr: SelfQR }) => {
  if (!qr) {
    return null
  }
  const title = qr.getTagTitle()
  const description = qr.getTagDescription()
  const color = qr.getTagColor()
  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: color,
        alignSelf: 'center',
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          color: color ? 'white' : 'black',
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZES[700],
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: color ? 'white' : 'black',
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZES[500],
        }}
      >
        {description}
      </Text>
    </View>
  )
}
