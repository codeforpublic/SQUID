import React, { useEffect, useState } from 'react'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { useSafeArea } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
} from 'react-native'
import { useSelfQR } from '../../../state/qr'
import { pushNotification } from '../../../services/notification'
import { QRBackground } from './QRBackground'
import { QRAvatar } from './QRAvatar'
import { QRTagLabel } from './QRTagLabel'
import { QRHeader } from './QRHeader'
import { QRSection } from './QRSection'
import { QRFooter } from './QRFooter'
import DeviceInfo from 'react-native-device-info'
import { Text } from 'react-native-elements'
import { Beancon } from './Beacon'
import AsyncStorage from '@react-native-community/async-storage'

export const MainApp = () => {
  const inset = useSafeArea()
  const { qrData, qrState, error, refreshQR } = useSelfQR()
  const appVersion = DeviceInfo.getVersion();

  const [location, setLocation] = useState('')
  const getBeacon = async () => {
    //TEST
    // let lc = 'ห้าง Tesco lotus สาขาอโศก ตรงข้ามห้างดัง ตรงรถไฟฟ้ามหานครอมรรัตน'
    // AsyncStorage.setItem('beacon-location', lc);
    let beacon = await AsyncStorage.getItem('beacon-location');
    if (beacon) {
      setLocation(beacon)
    }
  }

  useEffect(() => {
    pushNotification.requestPermissions()
    getBeacon()
  }, [])

  return (
    <View
      style={[styles.container, { paddingTop: inset.top, paddingBottom: 12 }]}
    >
      <StatusBar
        barStyle={qrData?.getTagColor() ? 'light-content' : 'dark-content'}
        backgroundColor={qrData?.getTagColor() ? COLORS.BLACK_1 : COLORS.PRIMARY_LIGHT}
      />
      <QRBackground qr={qrData} />
      <QRAvatar qr={qrData} qrState={qrState} />
      <QRTagLabel qr={qrData} />
      <Beancon location={location} />
      <QRHeader qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
      <QRSection qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
      <QRFooter />
      <Text
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            paddingRight: 5,
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZES[500] * 0.85,
            textAlign: 'right',
            color: '#0FA7DC'
          }}
        >
        V {appVersion}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
})
