import React, { useState } from 'react'
import { MockScreen } from '../MockScreen'
import { Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Camera, TakePictureResponse, RNCamera } from '../../components/Camera'
import { COLORS } from '../../styles'
import styled, { css } from '@emotion/native'

const SelfieCaptureGuideline = () => {
  return (
    <GuidelineContainer>
      <FaceGuideline />
      {/* <CardGuideline /> */}
    </GuidelineContainer>
  )
}

const GuidelineContainer = styled.View`  
  flex: 1;
  align-items: center;
  justify-content: center;  
`

const FaceGuideline = styled.View`
  width: 70%;
  border-color: ${COLORS.PRIMARY_LIGHT};
  border-width: 2px;
  border-radius: 500px;
  border-style: dashed;
  aspect-ratio: 1;
`


export const OnboardFace = () => {  
  const [openCamera, setOpenCamera] = useState(false)  
  const [uri, setURI] = useState<string | null>(null)
  const onCapture = async (camera: RNCamera) => {
    const data: TakePictureResponse = await camera.takePictureAsync()
    setURI(data.uri)
    setOpenCamera(false)
  }
  if (openCamera) {
    return (
      <Camera onCapture={onCapture} type="front">
        <SelfieCaptureGuideline />
      </Camera>
    )
  }
  return (
    <MockScreen
      title="รูปถ่ายหน้าตรง"
      nextScreen="OnboardLocation"
      disabledNext={!uri}
      content={
        <TouchableOpacity onPress={() => setOpenCamera(true)}>
          <Avatar
            size={250}
            rounded
            source={uri? { uri }: void 0}
            icon={uri? void 0: { name: 'camera', type: 'entypo' }}
          />
        </TouchableOpacity>
      }
    />
  )
}
