import React from 'react'
import { UpdateFaceCamera } from '../../components/UpdateFaceCamera'
import { useNavigation } from 'react-navigation-hooks'

export const OnboardFaceCamera = () => {
  const navigation = useNavigation()
  return (
    <UpdateFaceCamera
      onCapture={uri => {
        if (navigation.state.params.setUri) {
          navigation.state.params.setUri(uri)
        }
        navigation.goBack()
      }}
    />
  )
}
