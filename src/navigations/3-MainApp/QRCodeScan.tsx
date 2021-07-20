import React, { useState, useRef, useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Dimensions, StatusBar, Platform } from 'react-native'
import { COLORS, FONT_MED } from '../../styles'
import { Title, Subtitle, Header } from '../../components/Base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verifyToken, decodeJWT } from '../../utils/jwt'
import { useIsFocused } from 'react-navigation-hooks'
import { QRResult, tagManager } from '../../state/qr'
import NotificationPopup from 'react-native-push-notification-popup'
import { QRPopupContent } from './QRPopupContent'
import { scanManager } from '../../services/contact-scanner'

import I18n from '../../../i18n/i18n'
import { backgroundTracking } from '../../services/background-tracking'

export const QRCodeScan = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [qrResult, setQRResult] = useState<QRResult>(null)
  const popupRef = useRef<NotificationPopup>()

  useEffect(() => {
    tagManager.update()
  }, [isFocused])

  useEffect(() => {
    if (qrResult) {
      popupRef.current.show({
        appTitle: I18n.t('risk_level'),
        title: qrResult.getLabel(),
        timeText: qrResult.getTag()?.title,
      })
      scanManager.add(qrResult.annonymousId)
    }
  }, [qrResult])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      {isFocused ? (
        <QRCodeScanner
          showMarker
          markerStyle={{
            borderColor: COLORS.WHITE,
          }}
          cameraStyle={{
            marginLeft: 8,
            marginRight: 8,
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width - 16,
            overflow: 'hidden',
          }}
          onRead={async (e) => {
            try {
              if (e?.data?.startsWith('https://qr.thaichana.com/?appId')) {
                const closeStr = 'closeBtn=true'
                const uri = e?.data?.includes('?')
                  ? e?.data + '&' + closeStr
                  : e?.data + '?' + closeStr
                navigation.navigate('Webview', {
                  uri,
                  onClose: () => {
                    navigation.pop()
                  },
                })
                backgroundTracking.getLocation({
                  extras: { triggerType: 'thaichana', url: e.data },
                })
                return
              }
              await verifyToken(e?.data)
              const decoded = decodeJWT(e?.data)
              if (!decoded?._) {
                throw new Error('Invalid')
              }
              setQRResult(new QRResult(decoded))
            } catch (err) {
              alert(I18n.t('wrong_data'))
            }
          }}
          fadeIn={false}
          reactivate
          reactivateTimeout={5000} //Use this to configure how long it should take before the QRCodeScanner should reactivate.
          containerStyle={{ flex: 1 }}
          topContent={
            <Header>
              <Title>{I18n.t('scan_qr')}</Title>
              <Subtitle>
                {I18n.t('record_contact_and_estimate_risk')}
              </Subtitle>
            </Header>
          }
        />
      ) : (
        void 0
      )}
      <NotificationPopup
        ref={popupRef}
        renderPopupContent={(props) => (
          <QRPopupContent {...props} qrResult={qrResult} />
        )}
      />
    </SafeAreaView>
  )
}
