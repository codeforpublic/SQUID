import React from 'react'
import { useHUD } from '../HudView'
import { RNCamera, TakePictureResponse, Camera } from './Camera'
import RNFS from 'react-native-fs'
import { Platform, Alert } from 'react-native'
import { SelfieCaptureGuideline } from './SelfieCaptureGuideline'
import ImageEditor from '@react-native-community/image-editor'

export const UpdateFaceCamera = ({ onCapture, ...props }) => {
  const { showSpinner, hide } = useHUD()
  const onCameraCapture = async (camera: RNCamera) => {
    showSpinner()
    try {
      const data: TakePictureResponse = await camera.takePictureAsync()
      console.log('ImageEditor', ImageEditor)
      if (ImageEditor) {
        const width = Math.floor((70 / 100) * Math.min(data.width, data.height))
        const height = width
        const offsetX = Math.floor((data.width - width) / 2)
        const offsetY = Math.floor((data.height - height) / 2)
        const uri = await ImageEditor.cropImage(data.uri, {
          offset: { x: offsetX, y: offsetY },
          size: { width, height },
          displaySize: { width, height },
          resizeMode: 'cover',
        })
  
        onCapture(uri)
      } else {
        onCapture(data.uri)
      }
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
