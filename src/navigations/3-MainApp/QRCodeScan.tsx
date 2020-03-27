import React, { useState } from 'react'
import { MockScreen } from '../MockScreen'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../../styles'
import { Title, Subtitle, Header } from '../../components/Base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { decodeJWT } from '../../utils/jwt'
import { MyBackground } from '../../components/MyBackground'
import { useNavigation, useIsFocused } from 'react-navigation-hooks'
import { QRCodeResult } from './QRCodeResult'

export const QRCodeScan = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [data, setData] = useState(null)
  if (data) {
    return <QRCodeResult data={data} onRescan={() => setData(null)} />
  }
  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        {isFocused? <QRCodeScanner
          showMarker
          markerStyle={{
            borderColor: COLORS.PRIMARY_LIGHT
          }}
          cameraStyle={{
            marginLeft: 8,
            marginRight: 8,
            width: Dimensions.get('window').width - 16
          }}
          onRead={e => {
            const decoded = e.data ? decodeJWT(e?.data) : null
            console.log('e', decoded, decoded.iat)
            if (!decoded?.color) {
              alert('ข้อมูลไม่ถูกต้อง')
              return
            }
            setData(decoded)
          }}
          fadeIn={false}
          reactivate
          reactivateTimeout={5} //Use this to configure how long it should take before the QRCodeScanner should reactivate.
          containerStyle={{ flex: 1 }}
          topContent={
            <Header>
              <Title>แสกน QR</Title>
              <Subtitle>เพื่อตรวจสอบความเสี่ยง</Subtitle>
            </Header>
          }
        />: void 0}
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
