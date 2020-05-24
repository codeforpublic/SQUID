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
import { Header } from './Header'
import { Graph } from './Graph'
import { LocationCount } from './LocationCount'

export const LocationReport = () => {
  const inset = useSafeArea()
  const { qrData, qrState, error, refreshQR } = useSelfQR()  

  useEffect(() => {
    pushNotification.requestPermissions();
  }, [])

  return (
    <View style={[styles.container, { paddingTop: inset.top, paddingBottom: 12 }]}>
      <Header qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
      <Graph></Graph>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
})
