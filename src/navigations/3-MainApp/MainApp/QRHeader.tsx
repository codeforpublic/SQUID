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

import I18n from '../../../../i18n/i18n';

export const QRHeader = ({ qr, qrState, onRefreshQR }: { qr: SelfQR, qrState: QR_STATE, onRefreshQR: any }) => {
  const timeSinceLastUpdate = qr ? Date.now() - qr.timestamp : 0  
  const color = qr
    ? qr.getStatusColor()
    : qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED
    ? COLORS.ORANGE_2
    : COLORS.GRAY_2  
  const label = qr
    ? qr.getLabel()
    : qrState === QR_STATE.NOT_VERIFIED
    ? I18n.t('undetermined_risk')
    : qrState === QR_STATE.LOADING
    ? I18n.t('wait_a_moment')
    : qrState === QR_STATE.FAILED
    ? I18n.t('undetermined_risk')
    : ''
    
  return (
    <View
        style={{
          backgroundColor: 'white',
          marginTop: 16,
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
            source={require('../morchana.png')}
            style={{
              marginRight: 10,
            }}
            resizeMode="contain"
          />
          <View>
            {label ? (
              <Text
                style={{
                  fontFamily: FONT_BOLD,
                  fontSize: FONT_SIZES[600],
                  marginTop: 12,
                  textDecorationLine: 'underline',
                  color,
                  alignSelf: 'center',
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
                {I18n.t('no_update_for')} {Math.floor(timeSinceLastUpdate / 60000)}{' '}
                {I18n.t('minute_s')}
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
                {I18n.t('last_update')}{` ${qr.getCreatedDate().format(I18n.t('hh_mm'))}`}
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
