import React, { useState, useRef } from 'react'
import styled, { css } from '@emotion/native'

import { RNCamera, TakePictureResponse } from 'react-native-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
// import ImagePicker from 'react-native-image-picker';
import { StyleSheet, View, TouchableOpacity, StatusBar, NativeModules, Platform } from 'react-native'
import { COLORS } from '../styles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from 'react-navigation-hooks'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { request, PERMISSIONS } from 'react-native-permissions'
import { useHUD } from '../HudView'

export type { TakePictureResponse, RNCamera }

const ShutterButtonOuter = styled.View`
  width: 72px;
  border-radius: 37px;
  border-style: solid;
  border-width: 4px;
  border-color: white;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
`

const ShutterButtonInner = styled.View`
  background-color: transparent;
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
    // style={{ padding: 16 }}
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
    style={{ position: 'absolute', left: 0, padding: 16, alignSelf: 'center'}}
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
const CloseButton = ({onClose}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    // style={{ padding: 16 }}
    onPress={() => {
        onClose()
    }}
  >
    <EvilIcons name="close" color="white" size={48} />
  </TouchableOpacity>
)

const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  quality: 1.0,
}

const isImagePickerAvailable = Boolean(NativeModules.ImagePickerManager)
const SelectImageButton = ({onSelectImage}) => {
  if (!isImagePickerAvailable) {
    return null
  }
  const ImagePicker = require('react-native-image-picker')
  const options = {
    ...DEFAULT_OPTIONS,
    title: 'Select Avatar',
  };
  const { showSpinner, hide } = useHUD()
  return (
  <TouchableOpacity
    activeOpacity={0.8}
    style={{ position: 'absolute', right: 0, padding: 16, alignSelf: 'center'}}
    onPress={async () => {
      showSpinner()
      ImagePicker.launchImageLibrary(options, (response) => {
        hide()
        // console.log({ response })
        if (Platform.OS == 'android' && "data" in response) {
          const newFilePath = `${Date.now()}-tmp`
          let tmpPath = `${RNFS.CachesDirectoryPath}/${newFilePath}`
          RNFetchBlob.fs.writeFile(tmpPath, response.data, 'base64')
            .then(() => {})
            .finally(() => {
              const uri = 'file://' + tmpPath
              onSelectImage(uri)
            })
        } else {
          const uri = response.uri
          onSelectImage(uri)  
        }
      });
    }}
  >
    <EntypoIcon name="images" color="white" size={32} />
  </TouchableOpacity>
)}

export const Camera = ({
  onCapture,
  onClose,
  onSelectImage,
  defaultType = 'back',
  children,
}: {
  onCapture: (camera: RNCamera) => any
  onSelectImage?: (uri: string) => any
  onClose?: any
  defaultType: 'front' | 'back'
  children
}) => {
  const cameraRef = useRef()
  const handleShutter = () => {
    onCapture(cameraRef.current)
  }
  const isFocused = useIsFocused()
  console.log('Camera', isFocused)
  const [cameraType, setCameraType] = useState(
    RNCamera.Constants.Type[defaultType],
  )
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.auto)

  return (
    <View
      style={{ flex: 1, alignItems: 'center' }}
    >      
      {isFocused ? <RNCamera
        ref={cameraRef}
        flashMode={flashMode}
        type={cameraType}
        ratio="4:3"
        style={{ flex: 1, aspectRatio: 3/4 }}
        captureAudio={false}
      >
        {children}
      </RNCamera>: null}
      <View style={{ width: '100%', flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, position: 'absolute' }}>
        {onClose ? <CloseButton onClose={onClose} />: null}
        <FlashButton flashMode={flashMode} setFlashMode={setFlashMode} />
      </View>
      <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'flex-end', position: 'absolute', bottom: 0}}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ShutterButtonOuter>
            <ShutterButtonInner>
              <ShutterButton onPress={handleShutter} />
            </ShutterButtonInner>
          </ShutterButtonOuter>
          <CameraDirectionButton
            cameraType={cameraType}
            setCameraType={setCameraType}
          />
          {isImagePickerAvailable && onSelectImage ?         
            <SelectImageButton onSelectImage={onSelectImage}/>: null
          } 
        </View>
      </View>
      
    </View>
  )
}
