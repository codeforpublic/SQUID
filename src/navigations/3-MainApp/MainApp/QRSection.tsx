import React, { Fragment } from 'react'
import { COLORS } from '../../../styles'
import {
  Image,
  ActivityIndicator,
} from 'react-native'
import 'moment/locale/th'
import { QRStateText } from './QRStateText'
import Sizer from 'react-native-size'
import { QR_STATE, SelfQR } from '../../../state/qr'

export const QRSection = ({ qr, qrState, onRefreshQR }: { qr: SelfQR, qrState: QR_STATE, onRefreshQR: any }) => {
  const qrUri = qr?.getQRImageURL()
  return (
    <Sizer
    style={{
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      backgroundColor: COLORS.WHITE,
      borderColor: COLORS.GRAY_1,
      borderStyle: 'solid',
      maxHeight: 320,
    }}
  >
    {({ height }) => {
      const size = height ? Math.min(320, height) : void 0
      const qrPadding = (20 / 300) * size
      return size ? (
        <Fragment>
          {qr ? (
            <Image
              style={{
                width: size,
                height: size,
                opacity: qrState === QR_STATE.EXPIRE ? 0.05 : 1,
              }}
              source={{
                uri: qrUri,
              }}
            />
          ) : (
            <Image
              style={{
                width: size - qrPadding * 2,
                height: size - qrPadding * 2,
                padding: qrPadding,
                opacity: 0.1,
              }}
              source={require('../../../assets/qr-placeholder.png')}
            />
          )}
          <QRStateText qrState={qrState} refreshQR={onRefreshQR} />
        </Fragment>
      ) : (
        <ActivityIndicator size="large" />
      )
    }}
  </Sizer>
  )
}
