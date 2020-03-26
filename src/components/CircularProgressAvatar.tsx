import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native'
import { COLORS, FONT_FAMILY } from '../styles'

export const CircularProgressAvatar = ({
  image,
  progress,
  color,
  width = Math.floor((60 / 100) * Dimensions.get('screen').width),
}) => {
  const outerPad = 11
  const circularWidth = width - (outerPad + 1) * 2
  return (
    <View
      style={{
        padding: outerPad,
        borderRadius: Math.floor(width / 2),
        width,
        height: width,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: COLORS.GRAY_1,
      }}
    >
      <View style={{ position: 'relative' }}>
        <AnimatedCircularProgress
          size={circularWidth}
          width={12}
          backgroundWidth={12}
          fill={progress}
          tintColor={color}
          tintColorSecondary={color}
          backgroundColor={COLORS.GRAY_1}
          arcSweepAngle={360}
          rotation={30}
          lineCap="round"
        />
        <View style={styles.imageWrapper}>
          {image ? (
            <Image
              source={image}
              style={{
                width: Math.floor((78 / 100) * circularWidth),
                height: Math.floor((78 / 100) * circularWidth),
                borderRadius: Math.floor(((78 / 100) * circularWidth) / 2),
              }}
            />
          ) : null}
        </View>
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
