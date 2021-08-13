import React from 'react'
import { Image } from 'react-native'
import SvgUri from 'react-native-svg-uri-reborn'

export const Logo = ({ uri, size }) => {
  return uri.includes('svg') ? (
    <SvgUri
      style={{ alignSelf: 'center' }}
      source={{
        uri,
      }}
      width={size}
      height={size}
    />
  ) : (
    <Image
      style={{ alignSelf: 'center' }}
      source={{
        uri,
      }}
      resizeMode='contain'
      width={size}
      height={size}
    />
  )
}
