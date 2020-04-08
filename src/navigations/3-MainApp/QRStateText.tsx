import React from 'react'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { userPrivateData } from '../../state/userPrivateData'
import { useSelfQR, QR_STATE } from '../../state/qr'
import { useNavigation } from 'react-navigation-hooks'
import { useResetTo } from '../../utils/navigation'

export const QRStateText = ({
  qrState,
  refreshQR,
}: {
  qrState: QR_STATE
  refreshQR: () => void
}) => {
  const navigation = useNavigation()
  const resetTo = useResetTo()

  switch (qrState) {
    case QR_STATE.FAILED:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={refreshQR}
          style={[styles.qrOverlay, { borderColor: COLORS.RED }]}
        >
          <Text style={[styles.title, { color: COLORS.RED }]}>ไม่สามารถสร้าง QR ได้</Text>
          <Text
            style={styles.subtitle}
          >
            เชื่อมต่ออินเทอร์เน็ตเพื่อสร้าง QR
          </Text>
          <Text style={styles.link}>ลองอีกครั้ง</Text>
        </TouchableOpacity>
      )
    case QR_STATE.LOADING:
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.BLACK_1} />
        </View>
      )
    case QR_STATE.EXPIRE:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={refreshQR}
          style={[styles.qrOverlay, { borderColor: COLORS.RED }]}
        >
          <Text style={[styles.title, { color: COLORS.RED }]}>
            QR หมดอายุแล้ว
          </Text>
          <Text style={styles.subtitle}>เชื่อมต่ออินเทอร์เน็ตเพื่ออัปเดต</Text>
          <Text style={styles.link}>ลองอีกครั้ง</Text>
        </TouchableOpacity>
      )
    case QR_STATE.NOT_VERIFIED:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate({
              routeName: 'AuthPhone',
              params: {
                backIcon: 'close',
                onBack: () => resetTo({ routeName: 'MainApp' }),
              },
            })
          }}
          style={styles.qrOverlay}
        >
          <View>
            <Text style={styles.title}>ยืนยันเบอร์โทรศัพท์</Text>
            <Text style={styles.subtitle}>สำหรับนำ QR Code ไปใช้ check-in</Text>
            <Text style={styles.link}>กดเพื่อยืนยัน</Text>
          </View>
        </TouchableOpacity>
      )
    default:
      return null
  }
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.BLACK_1,
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.BLACK_1,
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
  },
  link: {
    color: '#02A0D7',
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  qrOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderWidth: 3,
    borderRadius: 3,
    borderColor: '#0C2641',
  },
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
})
