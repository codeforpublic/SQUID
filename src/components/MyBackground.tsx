import React from 'react'
import { ImageBackground } from 'react-native'

type Variants = 'dark' | 'light' | 'home'
type Props = {
  children?: React.ReactNode
  variant?: Variants
}

const MAP = {
  dark: require('../assets/bg-dark.png'),
  light: require('../assets/bg-light.png'),
  home: require('../assets/bg-home.png'),
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
