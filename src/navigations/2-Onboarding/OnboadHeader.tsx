import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'

interface PropTypes {
  style?: any
  children?: any
  onBack?: any
  backIcon?: string
}

export const OnboardHeader = ({
  style,
}: PropTypes) => {
  const logoHeight = Dimensions.get('window').height < 600 ? 40 : 60
  const logoWidth = (logoHeight * 101) / 54
  return (
    <View style={style}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo_white.png')}
          style={{ height: logoHeight, width: logoWidth }}
          resizeMode="contain"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    flexDirection: 'row',
  },

  space: {
    flex: 1,
  },
})
