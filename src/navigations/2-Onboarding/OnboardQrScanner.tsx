import React from 'react'
import { COLORS, FONT_BOLD, FONT_SIZES } from '../../styles'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Dimensions, StyleSheet, Text } from 'react-native'
import I18n from 'i18n-js'
import { WhiteBackground } from '../../components/WhiteBackground'
import { PageBackButton } from './components/PageBackButton'

export const OnboardQrScanner = () => {
  const onScan = () => console.log('on scan naja')

  return (
    <WhiteBackground>
      <PageBackButton label={I18n.t('personal_information')} />
      <QRCodeScanner
        showMarker
        topContent={<Text style={styles.title}>{I18n.t('scan_qr_code')}</Text>}
        markerStyle={{
          borderColor: COLORS.WHITE,
        }}
        cameraStyle={styles.cameraStyle}
        onRead={onScan}
        fadeIn={false}
        reactivate
        reactivateTimeout={5000}
      />
    </WhiteBackground>
  )
}

const styles = StyleSheet.create({
  cameraStyle: {
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    overflow: 'hidden',
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[800],
    lineHeight: 36,
    alignItems: 'center',
    color: COLORS.BLUE_BUTTON,
    textAlign: 'center',
    width: '100%',
  },
})
