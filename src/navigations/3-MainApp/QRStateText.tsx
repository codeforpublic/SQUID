import React from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
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
          style={styles.qrOverlay}
        >
          <Text
            style={{
              color: COLORS.GRAY_4,
              fontSize: 24,
              fontFamily: FONT_FAMILY,
            }}
          >
            ไม่สามารถสร้าง QR ได้
          </Text>
          <Text
            style={{
              color: COLORS.GRAY_4,
              fontFamily: FONT_FAMILY,
            }}
          >
            เชื่อมต่ออินเทอร์เน็ตเพื่อสร้าง QR
          </Text>
          <Text
            style={{
              color: '#02A0D7',
              fontFamily: FONT_FAMILY,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}
          >
            ลองอีกครั้ง
          </Text>
        </TouchableOpacity>
      )
    case QR_STATE.LOADING:
      return (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <ActivityIndicator size="large" color="black" />
        </View>
      )
    case QR_STATE.EXPIRE:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={refreshQR}
          style={styles.qrOverlay}
        >
          <Text
            style={{
              color: 'red',
              fontSize: 24,
              fontFamily: FONT_FAMILY,
            }}
          >
            QR หมดอายุแล้ว
          </Text>
          <Text
            style={{
              color: 'red',
              fontFamily: FONT_FAMILY,
            }}
          >
            เชื่อมต่ออินเทอร์เน็ตเพื่ออัพเดท
          </Text>
          <Text
            style={{
              color: '#02A0D7',
              fontFamily: FONT_FAMILY,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}
          >
            ลองอีกครั้ง
          </Text>
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
            <Text
              style={{
                color: COLORS.BLACK_1,
                fontSize: 20,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              ยืนยันเบอร์โทรศัพท์
            </Text>
            <Text
              style={{
                color: COLORS.BLACK_1,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              เพื่อนำ QR Code ไปใช้ Checkin
            </Text>
            <Text
              style={{
                color: '#02A0D7',
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}
            >
              กดเพื่อรับหรัส
            </Text>
          </View>
        </TouchableOpacity>
      )
    default:
      return null
  }
}

const styles = StyleSheet.create({
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
})
