import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { Text } from 'react-native-elements'
import RNFS from 'react-native-fs'
import NotificationPopup from 'react-native-push-notification-popup'
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context'
import Sizer from 'react-native-size'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import I18n from '../../../../i18n/i18n'
import { CircularProgressAvatar } from '../../../../src/components/CircularProgressAvatar'
import { userPrivateData } from '../../../../src/state/userPrivateData'
import { useResetTo } from '../../../../src/utils/navigation'
import { useContactTracer } from '../../../services/contact-tracing-provider'
import { pushNotification } from '../../../services/notification'
import { QR_STATE, SelfQR, useSelfQR } from '../../../state/qr'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { BeaconFoundPopupContent } from '../BeaconFoundPopup'
import { QRStateText } from './QRStateText'
import { UpdateProfileButton } from './UpdateProfileButton'

export const MainApp = () => {
  const inset = useSafeArea()
  const { qrData, qrState, refreshQR } = useSelfQR()
  const { beaconLocationName, enable, disable, isServiceEnabled } =
    useContactTracer()
  const appVersion = DeviceInfo.getVersion()
  const [location, setLocation] = useState('')
  const popupRef = useRef<NotificationPopup | any>()
  const smallDevice = Dimensions.get('window').height < 600

  useEffect(() => {
    setLocation(beaconLocationName.name)
    if (location && popupRef && popupRef.current) {
      popupRef.current.show({
        slideOutTime: 20 * 1000,
      })
    }
  }, [beaconLocationName, location])

  useEffect(() => {
    pushNotification.requestPermissions()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <View
        style={[
          styles.container,
          { paddingTop: inset.top, paddingBottom: inset.bottom },
        ]}
      >
        <StatusBar
          barStyle={qrData?.getTagColor() ? 'light-content' : 'dark-content'}
          backgroundColor={
            qrData?.getTagColor() ? COLORS.BLACK_1 : COLORS.PRIMARY_LIGHT
          }
        />
        <View style={styles.containerTop}>
          <View style={styles.containerHeader}>
            <TouchableOpacity style={styles.circularButton} onPress={refreshQR}>
              <FontAwesome
                name="refresh"
                color={COLORS.GRAY_4}
                size={24}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
            <Text style={styles.textHeader}>
              {qrData &&
                `${qrData.getCreatedDate().format(I18n.t('fully_date'))}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (isServiceEnabled) {
                  Alert.alert(
                    I18n.t('bluetooth_disable_alert_title'),
                    I18n.t('bluetooth_disable_alert_message'),
                    [
                      {
                        text: I18n.t('cancel'),
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: I18n.t('bluetooth_disable_alert_accept'),
                        onPress: disable,
                      },
                    ],
                  )
                } else {
                  enable()
                }
              }}
            >
              <FontAwesome
                name="bluetooth-b"
                color={COLORS.GRAY_4}
                size={24}
                style={{ marginRight: 10 }}
              />
              {isServiceEnabled ? (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: COLORS.GREEN,
                    position: 'absolute',
                    borderRadius: 50,
                    borderTopWidth: Math.floor((4 / 100) * 24),
                    right: Math.floor((8 / 100) * 50),
                  }}
                />
              ) : (
                void 0
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.containerCard}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, padding: 10 }}>
                  <AvatarProfile qr={qrData} qrState={qrState} />
                </View>
                <View style={{ flex: 2, alignContent: 'flex-start' }}>
                  <RiskLabel
                    qr={qrData}
                    qrState={qrState}
                    onRefreshQR={refreshQR}
                  />
                </View>
              </View>
              <View style={{ flex: 3 }}>
                <QRImage
                  qr={qrData}
                  qrState={qrState}
                  onRefreshQR={refreshQR}
                />
              </View>
              <View style={styles.cardFooter}>
                <Image
                  source={require('./logo-pin-morchana.png')}
                  style={{
                    height: smallDevice ? 20 : 30,
                    width: (smallDevice ? 20 : 30) * (260 / 140),
                  }}
                  resizeMode="contain"
                />
                <Text style={styles.textVersion}>
                  แอปพลิเคชันหมอชนะ{' '}
                  <Text
                    style={{
                      color: '#0FA7DC',
                      fontSize: FONT_SIZES[600] * 0.85,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    V{appVersion}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
        <NotificationPopup
          ref={popupRef}
          renderPopupContent={(props) => (
            <BeaconFoundPopupContent {...props} result={location} />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  containerTop: { flex: 1, flexDirection: 'column' },
  containerHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 0,
    paddingLeft: 15,
    paddingRight: 15,
    height: 68,
    alignItems: 'center',
  },
  circularButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'rgba(16, 170, 174, 0.2)',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
  },
  textHeader: {
    marginTop: 10,
    lineHeight: FONT_SIZES[600],
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    textAlign: 'center',
    color: COLORS.BLACK_1,
  },

  containerCard: {
    flex: 1,
    maxHeight: 550,
    padding: 10,
    margin: 15,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderColor: 'rgba(16, 170, 174, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 1,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardHeader: {
    height: 128,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flex: 0,
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVersion: {
    lineHeight: FONT_SIZES[600],
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600] * 0.85,
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
})

const QRImage = ({
  qr,
  qrState,
  onRefreshQR,
}: {
  qr: SelfQR
  qrState: QR_STATE
  onRefreshQR: any
}) => {
  const qrUri = qr?.getQRImageURL()
  return (
    <Sizer
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_1,
        borderStyle: 'solid',
        maxHeight: 350,
      }}
    >
      {({ height }: any) => {
        const size = height ? Math.min(350, height) : 0
        const qrPadding = (20 / 300) * size
        return size ? (
          <Fragment>
            {qr ? (
              <Image
                style={{
                  width: size,
                  height: size,
                  opacity: qrState === QR_STATE.EXPIRE ? 0.05 : 1,
                }}
                source={{
                  uri: qrUri,
                }}
              />
            ) : (
              <Image
                style={{
                  width: size - qrPadding * 2,
                  height: size - qrPadding * 2,
                  padding: qrPadding,
                }}
                source={require('../../../assets/qr-placeholder.png')}
              />
            )}
            <QRStateText qrState={qrState} refreshQR={onRefreshQR} />
          </Fragment>
        ) : (
          <ActivityIndicator size="large" />
        )
      }}
    </Sizer>
  )
}

const RiskLabel = ({
  qr,
  qrState,
}: {
  qr: SelfQR
  qrState: QR_STATE
  onRefreshQR: any
}) => {
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
    <View style={{ backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: FONT_BOLD,
              fontSize: FONT_SIZES[700],
              color,
              alignSelf: 'center',
            }}
          >
            {label}
          </Text>
        </View>
      </View>
    </View>
  )
}

const AvatarProfile = ({ qr, qrState }: { qr: SelfQR; qrState: QR_STATE }) => {
  const [faceURI, setFaceURI] = useState(userPrivateData.getFace())
  const resetTo = useResetTo()

  const color = qr
    ? qr.getStatusColor()
    : qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED
    ? COLORS.ORANGE_2
    : COLORS.GRAY_2

  // const avatarWidth = Math.min(
  //   100,
  //   Math.floor((20 / 100) * Dimensions.get('screen').height),
  // )

  const avatarWidth = 100
  useEffect(() => {
    RNFS.exists(faceURI).then((exists) => {
      console.log('exists', exists)
      if (!exists) {
        resetTo({
          routeName: 'Onboarding',
        })
      }
    })
  }, [])

  return (
    <TouchableWithoutFeedback>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          marginTop: 10,
        }}
      >
        <View>
          <CircularProgressAvatar
            key={qr ? qr.getCreatedDate() : 0}
            image={faceURI ? { uri: faceURI } : void 0}
            color={color}
            progress={100}
            width={avatarWidth}
          />
          <UpdateProfileButton
            width={Math.floor(avatarWidth / 4)}
            style={{
              position: 'absolute',
              bottom: Math.floor((4 / 100) * avatarWidth),
              right: Math.floor((4 / 100) * avatarWidth),
            }}
            onChange={setFaceURI}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
