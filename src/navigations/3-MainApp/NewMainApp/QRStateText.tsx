import React from 'react'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { QR_STATE } from '../../../state/qr'
import { useNavigation } from 'react-navigation-hooks'
import { useResetTo } from '../../../utils/navigation'

import I18n from '../../../../i18n/i18n';

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
          <Text style={[styles.title, { color: COLORS.RED }]}>{I18n.t('can_not_generate_qr')}</Text>
          <Text
            style={styles.subtitle}
          >
            {I18n.t('connect_internet_to_generate_qr')}
          </Text>
          <Text style={styles.link}>{I18n.t('try_again')}</Text>
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
            {I18n.t('qr_expired')}
          </Text>
          <Text style={styles.subtitle}>{I18n.t('connect_internet_to_update')}</Text>
          <Text style={styles.link}>{I18n.t('try_again')}</Text>
        </TouchableOpacity>
      )
    case QR_STATE.NOT_VERIFIED:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate({
              routeName: 'Onboarding',
              params: {
                backIcon: 'close',
                onBack: () => resetTo({ routeName: 'MainApp' }),
              },
            })
          }}
          style={styles.qrOverlay}
        >
          <View>
            <Text style={styles.title}>{I18n.t('confirm_phone_no')}</Text>
            <Text style={styles.subtitle}>{I18n.t('for_checking_in_with_qr')}</Text>
            <Text style={styles.link}>{I18n.t('press_to_confirm')}</Text>
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
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
  },
  link: {
    color: '#02A0D7',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
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
