import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { useSafeArea } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { useSelfQR } from '../../../state/qr'
import { pushNotification } from '../../../services/notification'
import { QRBackground } from './QRBackground'
import { QRAvatar } from './QRAvatar'
import { QRTagLabel } from './QRTagLabel'
import { QRHeader } from './QRHeader'
import { QRSection } from './QRSection'
import { QRFooter } from './QRFooter'
import DeviceInfo from 'react-native-device-info'
import { Text } from 'react-native-elements'
import NotificationPopup from 'react-native-push-notification-popup'
import { BeaconFoundPopupContent } from '../BeaconFoundPopup'
import { useContactTracer } from '../../../services/contact-tracing-provider'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import I18n from '../../../../i18n/i18n'

export const MainApp = () => {
  const inset = useSafeArea()
  const { qrData, qrState, refreshQR } = useSelfQR()
  const { beaconLocationName } = useContactTracer()
  const appVersion = DeviceInfo.getVersion();
  const [location, setLocation] = useState('')
  const popupRef = useRef<NotificationPopup | any>()
  const smallDevice = Dimensions.get('window').height < 600

  useEffect(() => {
    setLocation(beaconLocationName.name)
    if (location && popupRef && popupRef.current) {
      popupRef.current.show({
        slideOutTime: 5000
      })
    }
  }, [beaconLocationName])

  useEffect(() => {
    pushNotification.requestPermissions()
  }, [])

  return (
    <View
        style={[styles.container, { paddingTop: inset.top, paddingBottom: 12 }]}
    > 
      <NotificationPopup
        ref={popupRef}
        renderPopupContent={props => (
          <BeaconFoundPopupContent {...props} result={location} />
        )}
      />
     <StatusBar
        barStyle={qrData?.getTagColor() ? 'light-content' : 'dark-content'}
        backgroundColor={qrData?.getTagColor() ? COLORS.BLACK_1 : COLORS.PRIMARY_LIGHT}
      />
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 15,
          height: 68,
          alignItems: 'center'
        }}>
          <TouchableOpacity onPress={refreshQR}>
            <FontAwesome
              name="refresh"
              color={COLORS.GRAY_4}
              size={24}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity> 
          <Text
            style={{
              marginTop: 10,
              lineHeight: FONT_SIZES[600], 
              fontFamily: FONT_FAMILY,
              fontSize: FONT_SIZES[600],
              textAlign: 'center',
              color: COLORS.BLACK_1
            }}
          >
            {I18n.t('last_update')}{` ${qrData.getCreatedDate().format(I18n.t('hh_mm'))}`}
          </Text> 
          <TouchableOpacity onPress={() =>{}}>
            <FontAwesome
              name="bluetooth-b"
              color={COLORS.GRAY_4}
              size={24}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity> 
        </View>
        <View style={{ flex: 1 }}>
          <View style={{
            height: Dimensions.get('window').height * 0.7,
            padding: 10,
            margin: 15,
            borderRadius: 14,
            backgroundColor: "#FFF",
            borderColor: "rgba(16, 170, 174, 0.2)",
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2.84,
            elevation: 1,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <View style={{ height: Dimensions.get('window').height * 0.15, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <QRAvatar qr={qrData} qrState={qrState} />
                </View>
                <View style={{ flex: 2 }}>
                  <QRHeader qr={qrData} qrState={qrState} onRefreshQR={refreshQR} /> 
                </View>
              </View>
              <View style={{ height: Dimensions.get('window').height * 0.45 }}>
                <QRSection qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
              </View>
              <View style={{ height: Dimensions.get('window').height * 0.1,  width: '100%' }}>
                <View style={{ borderBottomColor: COLORS.GRAY_1, borderWidth: 1, width: '100%', opacity: 0.1 }}></View>
                <Text
                  style={{
                    flex: 0,
                    alignItems: 'center',
                    marginTop: 10,
                    lineHeight: FONT_SIZES[600], 
                    fontFamily: FONT_FAMILY,
                    fontSize: FONT_SIZES[600] * 0.85,
                    textAlign: 'center',
                    color: COLORS.BLACK_1
                  }}
                >
                   <Image
                      source={require('../../../assets/logo_header.png')}
                      style={{
                          height: smallDevice ? 20 : 30,
                          width: (smallDevice ? 20 : 30) * (260 / 140),
                      }}
                      resizeMode="contain"
                  />
                    แอปพลิเคชันหมอชนะ <Text style={{ color: '#0FA7DC', fontSize: FONT_SIZES[600] * 0.85, fontFamily: FONT_FAMILY }}>V{appVersion}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  // return (
  //   <View
  //     style={[styles.container, { paddingTop: inset.top, paddingBottom: 12 }]}
  //   >
  //     <NotificationPopup
  //       ref={popupRef}
  //       renderPopupContent={props => (
  //         <BeaconFoundPopupContent {...props} result={location} />
  //       )}
  //     />
  //     <StatusBar
  //       barStyle={qrData?.getTagColor() ? 'light-content' : 'dark-content'}
  //       backgroundColor={qrData?.getTagColor() ? COLORS.BLACK_1 : COLORS.PRIMARY_LIGHT}
  //     />
  //     <QRBackground qr={qrData} />
  //     <QRAvatar qr={qrData} qrState={qrState} />
  //     <QRTagLabel qr={qrData} />
  //     <QRHeader qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
  //     <QRSection qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
  //     <QRFooter />
  //     <Text
  //         style={{
  //           position: 'absolute',
  //           bottom: 0,
  //           right: 0,
  //           paddingRight: 5,
  //           fontFamily: FONT_FAMILY,
  //           fontSize: FONT_SIZES[500] * 0.85,
  //           textAlign: 'right',
  //           color: '#0FA7DC'
  //         }}
  //       >
  //       V {appVersion}
  //     </Text>
  //   </View>
  // )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
})
