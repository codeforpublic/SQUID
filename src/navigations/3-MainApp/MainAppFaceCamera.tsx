import React from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { UpdateFaceCamera } from '../../components/UpdateFaceCamera'
import { userPrivateData } from '../../state/userPrivateData'
import RNFS from 'react-native-fs'
import { RELATIVE_FACE_PATH } from '../const'
import { Platform } from 'react-native'

export const MainAppFaceCamera = () => {
  const navigation = useNavigation()
  return (
    <UpdateFaceCamera
      onClose={() => {
        navigation.goBack()
      }}
      onCapture={async uri => {
        await userPrivateData.setFace(uri, { isTempUri: true })
        if (navigation.state.params.setUri) {
          navigation.state.params.setUri(uri)
        }
        navigation.goBack()
      }}
    />
  )
}
