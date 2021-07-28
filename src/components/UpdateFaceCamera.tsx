import React from 'react'
import { useHUD } from '../HudView'
import { RNCamera, TakePictureResponse, Camera } from './Camera'
import RNFS from 'react-native-fs'
import { Platform, Alert, NativeModules, Dimensions } from 'react-native'
import { SelfieCaptureGuideline } from './SelfieCaptureGuideline'
import ImageEditor from '@react-native-community/image-editor'
import { applicationState } from '../state/app-state'

export const UpdateFaceCamera = ({ onCapture, ...props }) => {
  const { showSpinner, hide } = useHUD()
  const onCameraCapture = async (camera: RNCamera) => {
    showSpinner()
    try {
      const data: TakePictureResponse = await camera.takePictureAsync()
      console.log('ImageEditor', ImageEditor)
      if (NativeModules.RNCImageEditor) {
        const scale = Math.max(data.width, data.height) / Dimensions.get('screen').height
        const width = Math.floor(scale * (70 / 100) * Dimensions.get('screen').width)
        // const width = Math.floor((70 / 100) * Math.min(data.width, data.height))
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
      applicationState.setData('updateProfileDate', new Date().toISOString())
    } catch (err) {
      console.log(err)
      Alert.alert('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
    }
    hide()
  }

  return (
    <Camera onCapture={onCameraCapture} defaultType='front' {...props}>
      <SelfieCaptureGuideline />
    </Camera>
  )
}
