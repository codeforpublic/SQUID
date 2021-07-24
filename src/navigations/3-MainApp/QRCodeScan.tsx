import React, { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, StatusBar } from 'react-native'
import NotificationPopup from 'react-native-push-notification-popup'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from 'react-navigation-hooks'
import I18n from '../../../i18n/i18n'
import { Header, Subtitle, Title } from '../../components/Base'
import { backgroundTracking } from '../../services/background-tracking'
import { scanManager } from '../../services/contact-scanner'
import { useVaccine } from '../../services/use-vaccine'
import { QRResult, tagManager } from '../../state/qr'
import { COLORS } from '../../styles'
import { decodeJWT, verifyToken } from '../../utils/jwt'
import PopupImportVaccine from './NewMainApp/PopupImportVaccine'
import { QRPopupContent } from './QRPopupContent'

export const QRCodeScan = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { requestVaccine, resetVaccine, isVaccineURL } = useVaccine()
  const isFocused = useIsFocused()
  const [qrResult, setQRResult] = useState<QRResult>(null)
  const popupRef = useRef<NotificationPopup>()

  useEffect(() => {
    tagManager.update()
  }, [isFocused])

  useEffect(() => {
    if (qrResult) {
      popupRef.current?.show({
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
              const url = e?.data
              if (url?.startsWith('https://qr.thaichana.com/?appId')) {
                const closeStr = 'closeBtn=true'
                const uri = e?.data?.includes('?') ? e?.data + '&' + closeStr : e?.data + '?' + closeStr
                navigation.navigate('Webview', {
                  uri,
                  onClose: () => {
                    navigation.pop()
                  },
                })
                backgroundTracking.getLocation({
                  extras: { triggerType: 'thaichana', url: e.data },
                })
              } else if (requestVaccine && isVaccineURL && (await isVaccineURL(url))) {
                const result = await requestVaccine(url)
                try {
                  if (result.status === 'ERROR') {
                    Alert.alert(result.errorTitle || '', result.errorMessage || '')
                    return
                  }

                  setModalVisible(true)
                } catch (err) {
                  console.error('qr scan catch', err)
                }
              } else {
                await verifyToken(e?.data)
                const decoded = decodeJWT(e?.data)
                if (!decoded?._) {
                  throw new Error('Invalid')
                }
                setQRResult(new QRResult(decoded))
              }
            } catch (err) {
              Alert.alert(I18n.t('wrong_data'))
            }
          }}
          fadeIn={false}
          reactivate
          reactivateTimeout={5000} //Use this to configure how long it should take before the QRCodeScanner should reactivate.
          containerStyle={{ flex: 1 }}
          topContent={
            <Header>
              <Title>{I18n.t('scan_qr')}</Title>
              <Subtitle>{I18n.t('record_contact_and_estimate_risk')}</Subtitle>
            </Header>
          }
        />
      ) : null}
      <NotificationPopup
        ref={popupRef as any}
        renderPopupContent={(props) => <QRPopupContent {...props} qrResult={qrResult} />}
      />
      {modalVisible ? (
        <PopupImportVaccine
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onSelect={(status) => {
            if (status === 'ok') {
              navigation.navigate('MainApp', { card: 1 })
            } else {
              resetVaccine && resetVaccine()
            }
          }}
        />
      ) : null}
    </SafeAreaView>
  )
}
