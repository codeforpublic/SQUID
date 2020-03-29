import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native'
import { FONT_FAMILY, COLORS } from '../styles'

export const CircularProgressAvatar = ({
  image,
  progress,
  color,
  text,
  width = Math.floor((30 / 100) * Dimensions.get('screen').height),
  CustomComponent,
}: {
  image?: ImageSourcePropType
  progress: number
  color: string
  text?: string
  width?: number
  CustomComponent?: any
}) => {
  const outerPad = 8
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
          width={6}
          backgroundWidth={6}
          fill={progress}
          tintColor={color}
          tintColorSecondary={color}
          backgroundColor={COLORS.GRAY_1}
          arcSweepAngle={360}
          rotation={0}
          lineCap="round"
        />
        <View style={styles.imageWrapper}>
          {image ? (
            <Image
              source={image}
              style={{
                width: Math.floor((90 / 100) * circularWidth),
                height: Math.floor((90 / 100) * circularWidth),
                borderRadius: Math.floor(((90 / 100) * circularWidth) / 2),
              }}
            />
          ) : CustomComponent ? (
            <CustomComponent
              style={{
                width: Math.floor((90 / 100) * width),
                height: Math.floor((90 / 100) * width),
                borderRadius: Math.floor(((90 / 100) * width) / 2),
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
