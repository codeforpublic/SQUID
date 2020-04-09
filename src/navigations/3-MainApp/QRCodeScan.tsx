import React, { useState, useRef, useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Dimensions, StatusBar } from 'react-native'
import { COLORS } from '../../styles'
import { Title, Subtitle, Header } from '../../components/Base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { decodeJWT } from '../../utils/jwt'
import { MyBackground } from '../../components/MyBackground'
import { useIsFocused } from 'react-navigation-hooks'
import { QRResult, proficientManager } from '../../state/qr'
import NotificationPopup from 'react-native-push-notification-popup'
import { QRPopupContent } from './QRPopupContent'
import { scanManager } from '../../services/contact-scanner'
import moment from 'moment'

export const QRCodeScan = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [qrResult, setQRResult] = useState<QRResult>(null)
  console.log('qrResult', qrResult)
  const popupRef = useRef<NotificationPopup>()

  useEffect(() => {
    proficientManager.update()
  }, [isFocused])

  useEffect(() => {
    if (qrResult) {
      const createdData = qrResult.getCreatedDate()
      const userCreatedDate = qrResult.getUserCreatedDate()
      // const userCreatedDate = moment().subtract(3, 'day')

      const body = userCreatedDate? `ลงทะเบียนเมื่อ ${userCreatedDate.format('D MMMM​')} พ.ศ. ${userCreatedDate.year() +
        543}`: `ข้อมูลวันที่ ${createdData.format('D MMMM​')} พ.ศ. ${createdData.year() +
        543} ${createdData.format(`HH:mm น.`)}`
      popupRef.current.show({
        appTitle: 'ระดับความเสี่ยง',
        title: qrResult.getLabel(),
        body,
        timeText: qrResult.getProficientLabel(),
      })
      scanManager.add(qrResult.annonymousId)
    }
  }, [qrResult])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      {isFocused ? (
        <QRCodeScanner
          showMarker
          markerStyle={{
            borderColor: COLORS.WHITE,
          }}
          cameraStyle={{
            marginLeft: 8,
            marginRight: 8,
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width - 16,
            overflow: 'hidden',
          }}
          onRead={e => {
            const decoded = e.data ? decodeJWT(e?.data) : null
            if (!decoded?._) {
              alert('ข้อมูลไม่ถูกต้อง')
              return
            }
            setQRResult(new QRResult(decoded))
          }}
          fadeIn={false}
          reactivate
          reactivateTimeout={2000} //Use this to configure how long it should take before the QRCodeScanner should reactivate.
          containerStyle={{ flex: 1 }}
          topContent={
            <Header>
              <Title>สแกน QR</Title>
              <Subtitle>เพื่อบันทึกการเข้าใกล้และตรวจสอบความเสี่ยง</Subtitle>
            </Header>
          }
        />
      ) : (
        void 0
      )}
      <NotificationPopup
        ref={popupRef}
        renderPopupContent={props => (
          <QRPopupContent {...props} qrResult={qrResult} />
        )}
      />
    </SafeAreaView>
  )
}
