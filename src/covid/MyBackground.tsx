import React from 'react'
import { ImageBackground } from 'react-native'
import { COLORS } from '../styles'

type Variants = 'dark' | 'light' | 'home'
type Props = {
  children?: React.ReactNode
  variant?: Variants
}

const MAP = {
  dark: require('./bg-dark.png'),
  light: require('./bg-light.png'),
  home: require('./bg-home.png'),
}
export const MyBackground = ({ children, variant = 'dark' }: Props) => {
  return (
    <ImageBackground
      source={MAP[variant]}
      style={{
        height: undefined,
        width: undefined,
        flex: 1,
      }}
      imageStyle={{
        resizeMode: 'cover',
      }}
    >
      {children}
    </ImageBackground>
  )
}
