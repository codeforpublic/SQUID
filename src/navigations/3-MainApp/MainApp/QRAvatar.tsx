import React, { useEffect, useState } from 'react'
import { COLORS } from '../../../styles'
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import RNFS from 'react-native-fs'
import { CircularProgressAvatar } from '../../../components/CircularProgressAvatar'
import { userPrivateData } from '../../../state/userPrivateData'
import { QR_STATE, SelfQR } from '../../../state/qr'
import { useResetTo } from '../../../utils/navigation'
import { UpdateProfileButton } from '../UpdateProfileButton'

export const QRAvatar = ({ qr, qrState }: { qr: SelfQR, qrState: QR_STATE }) => {
  const [faceURI, setFaceURI] = useState(userPrivateData.getFace())
  const resetTo = useResetTo()
  
  const color = qr
    ? qr.getStatusColor()
    : qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED
    ? COLORS.ORANGE_2
    : COLORS.GRAY_2


  const avatarWidth = Math.min(
    200,
    Math.floor((20 / 100) * Dimensions.get('screen').height),
  )

  useEffect(() => {
    RNFS.exists(faceURI).then(exists => {
      console.log('exists', exists)
      if (!exists) {
        resetTo({
          routeName: 'Onboarding',
        })
      }
    })
  }, [])
  return (
    <TouchableWithoutFeedback>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
            marginTop: 20,
          }}
        >
          <View style={{ position: 'relative' }}>
            <CircularProgressAvatar
              key={qr ? qr.getCreatedDate() : 0}
              image={faceURI ? { uri: faceURI } : void 0}
              color={color}
              progress={100}
              width={avatarWidth}
            />
            <UpdateProfileButton
              width={Math.floor(avatarWidth / 6)}
              style={{
                position: 'absolute',
                bottom: Math.floor((8 / 100) * avatarWidth),
                right: Math.floor((8 / 100) * avatarWidth),
              }}
              onChange={setFaceURI}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
  )
}
