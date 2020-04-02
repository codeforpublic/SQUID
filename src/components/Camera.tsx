import React, { useState, useRef } from 'react'
import styled, { css } from '@emotion/native'

import { RNCamera, TakePictureResponse } from 'react-native-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'
// import ImagePicker from 'react-native-image-picker';
import { StyleSheet, View, TouchableOpacity, StatusBar, NativeModules } from 'react-native'
import { COLORS } from '../styles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from 'react-navigation-hooks'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { request, PERMISSIONS } from 'react-native-permissions'
import { useHUD } from '../HudView'

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
    style={{ padding: 16 }}
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
    style={{ padding: 16 }}
    onPress={() => {
        onClose()
    }}
  >
    <EvilIcons name="close" color="white" size={48} />
  </TouchableOpacity>
)

const DEFAULT_OPTIONS = {
  title: 'Select a Photo',
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo…',
  chooseFromLibraryButtonTitle: 'Choose from Library…',
  quality: 1.0,
  allowsEditing: false,
  permissionDenied: {
    title: 'Permission denied',
    text:
      'To be able to take pictures with your camera and choose images from your library.',
    reTryTitle: 're-try',
    okTitle: "I'm sure",
  },
  tintColor: '',
}

const isImagePickerAvailable = Boolean(NativeModules.ImagePickerManager)
const SelectImageButton = ({onSelectImage}) => {
  if (!isImagePickerAvailable) {
    return null
  }
  const ImagePicker = require('react-native-image-picker').default
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
        console.log({ response })
        const uri = response.uri // TODO: Android 11 cannot use this, find alternative way
        onSelectImage(uri)  
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}
    >
      <View style={{ width: '100%', flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        {onClose ? <CloseButton onClose={onClose} />: null}
        <FlashButton flashMode={flashMode} setFlashMode={setFlashMode} />
      </View>
      {isFocused ? <RNCamera
        ref={cameraRef}
        flashMode={flashMode}
        type={cameraType}
        ratio="4:3"
        style={{ width: '100%', aspectRatio: 3/4 }}
        captureAudio={false}
      >
        {children}
      </RNCamera>: null}
      <View style={{ flexDirection: 'row', paddingVertical: 8, flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ShutterButtonOuter>
            <ShutterButtonInner>
              <ShutterButton onPress={handleShutter} />
            </ShutterButtonInner>
          </ShutterButtonOuter>
        </View>
        <CameraDirectionButton
          cameraType={cameraType}
          setCameraType={setCameraType}
        />
        {isImagePickerAvailable && onSelectImage ?         
          <SelectImageButton onSelectImage={onSelectImage}/>: null
        } 
      </View>
      
    </SafeAreaView>
  )
}
