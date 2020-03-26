import React, { useState, useRef } from 'react'
import styled, { css } from '@emotion/native'

import { RNCamera, TakePictureResponse } from 'react-native-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'

import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { COLORS } from '../styles'
import Icon from 'react-native-vector-icons/EvilIcons'

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

export const Camera = ({ onCapture, defaultType='front', children }: { onCapture: (camera: RNCamera) => any, defaultType: 'front' | 'back', children }) => {
  const cameraRef = useRef()
  const handleShutter = () => {
    onCapture(cameraRef.current)
  }
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type[defaultType])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', position : 'relative'}}>
      <RNCamera
        ref={cameraRef}
        flashMode={RNCamera.Constants.FlashMode.off}
        type={cameraType}
        style={{ flex: 1, width: '100%', height: '100%' }}
        captureAudio={false}
      >
        {children}
      </RNCamera>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* <TouchableOpacity onPress={setFlashOn} style={{ flex: 1 }}>
          <Icon name={"ios-flash-off"} color="white" type="ionicon" />
        </TouchableOpacity> */}
        <ShutterButtonOuter>
          <ShutterButtonInner>
            <ShutterButton onPress={handleShutter} />
          </ShutterButtonInner>
        </ShutterButtonOuter>
      </View>
      <TouchableOpacity onPress={() => {
        setCameraType(cameraType === RNCamera.Constants.Type.front ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front)
      }} 
      style={{position: 'absolute', right: 16, top: 16}}>
        <Icon name="refresh" color="white" size={48} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}