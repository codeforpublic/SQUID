import ImageEditor from '@react-native-community/image-editor'
import React from 'react'
import { Alert, Dimensions, NativeModules } from 'react-native'
import { useHUD } from '../HudView'
import { applicationState } from '../state/app-state'
import { Camera, RNCamera, TakePictureResponse } from './Camera'
import { SelfieCaptureGuideline } from './SelfieCaptureGuideline'

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
