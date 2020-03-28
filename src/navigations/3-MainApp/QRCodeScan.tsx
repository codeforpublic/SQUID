import React, { useState, useRef, useEffect } from 'react'
import { MockScreen } from '../MockScreen'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBarIOS, StatusBar } from 'react-native'
import { COLORS } from '../../styles'
import { Title, Subtitle, Header } from '../../components/Base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { decodeJWT } from '../../utils/jwt'
import { MyBackground } from '../../components/MyBackground'
import { useNavigation, useIsFocused } from 'react-navigation-hooks'
import { QRCodeResult } from './QRCodeResult'
import { QRResult } from '../../state/qr'
import NotificationPopup from 'react-native-push-notification-popup'
import { QRPopupContent } from './QRPopupContent'

export const QRCodeScan = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [qrResult, setQRResult] = useState<QRResult>(null)
  const popupRef = useRef<NotificationPopup>()
  
  useEffect(() => {
    if (qrResult) {
      popupRef.current.show({ 
        appIconSource: require('./noti_icon.png'),
        appTitle: 'ระดับความเสี่ยง',
        title: qrResult.getLabel(),
        body: `ข้อมูลวันที่ ${qrResult.getCreatedDate().format('DD MMM YYYY HH:mm น.')}`
      })
    }
  }, [qrResult])
  return (
    <MyBackground variant="light">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.PRIMARY_LIGHT} />
      <SafeAreaView style={{ flex: 1 }}>
        {isFocused? <QRCodeScanner
          showMarker
          markerStyle={{
            borderColor: COLORS.PRIMARY_LIGHT
          }}
          cameraStyle={{
            marginLeft: 8,
            marginRight: 8,
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width - 16,
            overflow: 'hidden'
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
              <Title>แสกน QR</Title>
              <Subtitle>เพื่อตรวจสอบความเสี่ยง</Subtitle>
            </Header>
          }
        />: void 0}
        <NotificationPopup ref={popupRef} renderPopupContent={(props) => <QRPopupContent {...props} qrResult={qrResult} />} />
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})
