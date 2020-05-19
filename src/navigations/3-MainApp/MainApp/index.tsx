import React, { useEffect } from 'react'
import { COLORS } from '../../../styles'
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
import { LocationBar } from './LocationBar'

export const MainApp = () => {
  const inset = useSafeArea()  
  const { qrData, qrState, error, refreshQR } = useSelfQR()  

  useEffect(() => {
    pushNotification.requestPermissions()
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
      <QRHeader qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
      <QRSection qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
      <LocationBar />
      <QRFooter />
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
