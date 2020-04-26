import React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import { SelfQR } from '../../../state/qr'
import Color from 'color'

export const QRBackground = ({ qr }: { qr: SelfQR }) => {
  if (!qr) {
    return null
  }
  const tagColor = qr?.getTagColor()
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: tagColor
            ? tagColor
            : Color(qr.getStatusColor())
                .alpha(0.1)
                .toString(),
          height: '50%',
        },
      ]}
    />
  )
}