import React from 'react'
import styled from '@emotion/native'
import { COLORS } from '../styles'
import { Dimensions } from 'react-native'

const GuidelineContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const FaceGuideline = styled.View`
  border-color: ${COLORS.PRIMARY_LIGHT};
  border-width: 2px;
  border-radius: 500px;
  border-style: dashed;
  aspect-ratio: 1;
`

export const SelfieCaptureGuideline = () => {
  return (
    <GuidelineContainer>
      <FaceGuideline
        style={{
          width: Math.floor((70 / 100) * Dimensions.get('window').width),
        }}
      />
      {/* <CardGuideline /> */}
    </GuidelineContainer>
  )
}
