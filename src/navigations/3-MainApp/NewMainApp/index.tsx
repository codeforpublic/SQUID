import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import RNFS from 'react-native-fs'
import NotificationPopup from 'react-native-push-notification-popup'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import QRCard from './QRCard'
import { UpdateProfileButton } from './UpdateProfileButton'
import Carousel from 'react-native-snap-carousel'

export const MainApp = () => {
  // const inset = useSafeArea()
  const { qrData, qrState } = useSelfQR()
  const {
    beaconLocationName,
    enable,
    disable,
    isServiceEnabled,
  } = useContactTracer()
  const [location, setLocation] = useState('')
  const popupRef = useRef<NotificationPopup | any>()

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

  const firstName = 'Smith'
  const lastName = 'Johnson'

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        {
          // <StatusBar
          //   barStyle={qrData?.getTagColor() ? 'light-content' : 'dark-content'}
          //   backgroundColor={
          //     qrData?.getTagColor() ? COLORS.BLACK_1 : COLORS.PRIMARY_LIGHT
          //   }
          // />
        }
        <View style={styles.containerTop}>
          <View style={styles.containerHeader}>
            {
              // <TouchableOpacity style={styles.circularButton} onPress={refreshQR}>
              //   <FontAwesome
              //     name="refresh"
              //     color={COLORS.GRAY_4}
              //     size={24}
              //     style={{ marginLeft: 10 }}
              //   />
              // </TouchableOpacity>
              // <Text style={styles.textHeader}>
              //   {qrData &&
              //     `${qrData.getCreatedDate().format(I18n.t('fully_date'))}`}
              // </Text>
            }
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ position: 'relative' }}
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
                {isServiceEnabled ? <View style={styles.greenDot} /> : null}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileHeader}>
            <View style={styles.profileContainer}>
              {qrData && qrState && (
                <AvatarProfile qr={qrData} qrState={qrState} />
              )}
            </View>
            {firstName && (
              <Text style={styles.textFirstName}>
                {firstName}
                {'\n'}
                {lastName && (
                  <Text style={styles.textLastName}>{lastName}</Text>
                )}
              </Text>
            )}
          </View>
          <Carousel layout={'default'} />

          <QRCard />
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
  root: { flex: 1, backgroundColor: '#F9F9F9' },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  containerTop: { flex: 1, flexDirection: 'column' },
  containerHeader: {
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingTop: 0,
    paddingLeft: 15,
    paddingRight: 15,
    height: 40,
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
  profileTextContent: {
    paddingTop: 12,
    // backgroundColor: 'green',
  },
  profileHeader: {
    // flexDirection: 'row',
    width: '100%',
    height: 180,
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'left',
  },
  profileContainer: {
    width: '100%',
    height: 100,
  },
  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.GREEN,
    position: 'absolute',
    borderRadius: 50,
    borderTopWidth: Math.floor((4 / 100) * 24),
    right: Math.floor((8 / 100) * 50),
  },
  textFirstName: {
    color: '#222222',
    fontSize: FONT_SIZES[800],
    fontFamily: FONT_BOLD,
    paddingTop: 3,
  },
  textLastName: {
    color: '#222222',
    fontSize: FONT_SIZES[500],
  },
  flex1: {
    flex: 1,
  },
})

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
  }, [faceURI, resetTo])

  const buttonViewStyle = {
    flex: 1,
    alignItems: 'flex-start',
  } as const

  const buttonStyle = {
    position: 'absolute',
    bottom: Math.floor((4 / 100) * avatarWidth),
    right: Math.floor((4 / 100) * avatarWidth),
  } as const

  return (
    <TouchableWithoutFeedback>
      <View style={buttonViewStyle}>
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
            style={buttonStyle}
            onChange={setFaceURI}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
