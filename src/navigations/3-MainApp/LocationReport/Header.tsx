import React from 'react'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../../styles'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { QR_STATE, SelfQR } from '../../../state/qr'
import Ionicons from 'react-native-vector-icons/Ionicons'

export const Header = ({ qr, qrState, onRefreshQR }: { qr: SelfQR, qrState: QR_STATE, onRefreshQR: any }) => {
  const timeSinceLastUpdate = qr ? Date.now() - qr.timestamp : 0  
  const color = qr
    ? qr.getStatusColor()
    : qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED
    ? COLORS.ORANGE_2
    : COLORS.GRAY_2  
  const label = qr
    ? qr.getLabel()
    : qrState === QR_STATE.NOT_VERIFIED
    ? 'ยังไม่ทราบความเสี่ยง'
    : qrState === QR_STATE.LOADING
    ? 'รอสักครู่...'
    : qrState === QR_STATE.FAILED
    ? 'เกิดข้อผิดพลาด'
    : ''
    
  return (
    <View
        style={{
          backgroundColor: 'white',
          marginTop:  10,
          paddingTop: 8,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderColor: COLORS.GRAY_1,
          borderWidth: 1,
          borderBottomWidth: 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('./../../../assets/logo_header.png')}
            style={{
              marginRight: 5,
              width: 100,
            }}
            resizeMode="contain"
          />
          <View>
            {label ? (
              <Text
                style={{
                  fontFamily: FONT_BOLD,
                  fontSize: FONT_SIZES[600],
                  marginTop: 5,
                  textDecorationLine: 'underline',
                  color,
                }}
              >
                {label}
              </Text>
            ) : (
              void 0
            )}
            {qrState === QR_STATE.OUTDATE || qrState === QR_STATE.EXPIRE ? (
              <Text
                style={{
                  color: COLORS.ORANGE_2,
                  fontFamily: FONT_FAMILY,
                  fontSize: FONT_SIZES[500],

                  alignSelf: 'center',
                }}
              >
                ไม่ได้อัปเดตเป็นเวลา {Math.floor(timeSinceLastUpdate / 60000)}{' '}
                นาที
              </Text>
            ) : qr ? (
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: FONT_SIZES[500],
                  alignSelf: 'center',
                  color: COLORS.GRAY_4,
                }}
              >
                {`อัปเดตล่าสุด ${qr.getCreatedDate().format('HH:mm น.')}`}
              </Text>
            ) : (
              void 0
            )}
          </View>
          {qr || qrState !== QR_STATE.LOADING ? (
            <TouchableOpacity onPress={onRefreshQR}>
              <Ionicons
                name="ios-refresh"
                color={COLORS.BLACK_1}
                size={24}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          ) : (
            void 0
          )}
        </View>
      </View>
  )
}