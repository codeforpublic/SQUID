import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { COLORS, FONT_FAMILY } from '../styles'
import { Image } from 'react-native-elements'

export const CircularProgressAvatar = ({
  image,
  progress,
  color,
  text,
  width = Math.floor((75 / 100) * Dimensions.get('screen').width),
}) => {
  return (
    <View style={{ position: 'relative' }}>
      <AnimatedCircularProgress
        size={width}
        width={12}
        backgroundWidth={12}
        fill={progress}
        tintColor={color}
        tintColorSecondary={color}
        backgroundColor="#3d5875"
        arcSweepAngle={300}
        rotation={30}
        lineCap="round"
      />
      <View style={styles.wrapper}>
        <Text
          style={{
            fontFamily: FONT_FAMILY,
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: 20,
            lineHeight: 32,
            marginTop: -4,
            color,
          }}
        >
          {text}
        </Text>
      </View>
      <View style={styles.imageWrapper}>
        <Image
          source={image || require('../assets/mock-avatar.png')}
          style={{
            width: Math.floor((78 / 100) * width),
            height: Math.floor((78 / 100) * width),
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
