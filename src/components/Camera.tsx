import React, { useState, useRef } from 'react'
import styled, { css } from '@emotion/native'

import { RNCamera, TakePictureResponse } from 'react-native-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'

import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native'
import { COLORS } from '../styles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export type { TakePictureResponse, RNCamera }

const ShutterButtonOuter = styled.View`
  background-color: ${COLORS.ORANGE_2};
  width: 74px;
  border-radius: 37px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
`

const ShutterButtonInner = styled.View`
  background-color: black;
  width: 62px;
  border-radius: 31px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
`

const ShutterButton = styled.TouchableOpacity`
  background-color: ${COLORS.WHITE};
  width: 56px;
  border-radius: 28px;
  aspect-ratio: 1;
`

const FlashButton = ({ flashMode, setFlashMode }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={{ position: 'absolute', left: 0, padding: 16 }}
    onPress={() => {
      const sequences = [RNCamera.Constants.FlashMode.on, RNCamera.Constants.FlashMode.auto, RNCamera.Constants.FlashMode.off]
      setFlashMode(
        sequences[(sequences.indexOf(flashMode) + 1) % sequences.length]
      )
    }}
  >
    <MaterialCommunityIcons
      name={
        flashMode === RNCamera.Constants.FlashMode.on
          ? 'flash'
          : flashMode === RNCamera.Constants.FlashMode.off
          ? 'flash-off'
          : 'flash-auto'
      }
      color="white"
      size={36}
    />
  </TouchableOpacity>
)
const CameraDirectionButton = ({ setCameraType, cameraType }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={{ position: 'absolute', right: 0, padding: 16 }}
    onPress={() => {
      setCameraType(
        cameraType === RNCamera.Constants.Type.front
          ? RNCamera.Constants.Type.back
          : RNCamera.Constants.Type.front,
      )
    }}
  >
    <EvilIcons name="refresh" color="white" size={48} />
  </TouchableOpacity>
)

export const Camera = ({
  onCapture,
  defaultType = 'front',
  children,
}: {
  onCapture: (camera: RNCamera) => any
  defaultType: 'front' | 'back'
  children
}) => {
  const cameraRef = useRef()
  const handleShutter = () => {
    onCapture(cameraRef.current)
  }
  const [cameraType, setCameraType] = useState(
    RNCamera.Constants.Type[defaultType],
  )
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.auto)

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}
    >
      <RNCamera
        ref={cameraRef}
        flashMode={flashMode}
        type={cameraType}
        style={{ flex: 1, width: '100%', height: '100%' }}
        captureAudio={false}
      >
        {children}
      </RNCamera>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {/* <TouchableOpacity onPress={setFlashOn} style={{ flex: 1 }}>
          <EvilIcons name={"ios-flash-off"} color="white" type="ionicon" />
        </TouchableOpacity> */}
          <ShutterButtonOuter>
            <ShutterButtonInner>
              <ShutterButton onPress={handleShutter} />
            </ShutterButtonInner>
          </ShutterButtonOuter>
        </View>
        <FlashButton flashMode={flashMode} setFlashMode={setFlashMode} />
        <CameraDirectionButton
          cameraType={cameraType}
          setCameraType={setCameraType}
        />
      </View>
    </SafeAreaView>
  )
}
