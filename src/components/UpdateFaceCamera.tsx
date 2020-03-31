import React from 'react'
import { useHUD } from '../HudView'
import { RNCamera, TakePictureResponse, Camera } from './Camera'
import RNFS from 'react-native-fs'
import { Platform, Alert } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { SelfieCaptureGuideline } from './SelfieCaptureGuideline'

export const UpdateFaceCamera = ({ onCapture, ...props }) => {
  const { showSpinner, hide } = useHUD()
  const onCameraCapture = async (camera: RNCamera) => {
    showSpinner()
    try {
      const data: TakePictureResponse = await camera.takePictureAsync()
      onCapture(data.uri)
    } catch (err) {
      console.log(err)
      Alert.alert('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
    }
    hide()
  }

  return (
    <Camera onCapture={onCameraCapture} defaultType="front" {...props}>
      <SelfieCaptureGuideline />
    </Camera>
  )
}
