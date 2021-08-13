import { useNavigation } from '@react-navigation/native'
import I18n from 'i18n-js'
import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import RNFS from 'react-native-fs'
import GPSState from 'react-native-gps-state'
import NotificationPopup from 'react-native-push-notification-popup'
import { useSafeArea } from 'react-native-safe-area-view'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Carousel from '../../../../src/components/Carousel'
import { CircularProgressAvatar } from '../../../../src/components/CircularProgressAvatar'
import { useVaccine } from '../../../../src/services/use-vaccine'
import { applicationState, useApplicationState } from '../../../../src/state/app-state'
import { userPrivateData } from '../../../../src/state/userPrivateData'
import { useResetTo } from '../../../../src/utils/navigation'
import { useContactTracer } from '../../../services/contact-tracing-provider'
import { pushNotification } from '../../../services/notification'
import { QR_STATE, SelfQR, useSelfQR } from '../../../state/qr'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { BeaconFoundPopupContent } from '../BeaconFoundPopup'
import QRCard from './QRCard'
import { UpdateProfileButton } from './UpdateProfileButton'
import VaccineCard from './VaccineCard'
import WorkFromHomeCard from './WorkFromHomeCard'

const carouselItems = ['qr', 'vaccine'] //, 'wfh']

// Can change up to 3 picture a week.
export const MAX_CHANGE_PROFILE_LIMIT = 3
const mapQrStatusColor = (qr?: SelfQR, qrState?: QR_STATE) =>
  qr
    ? qr.getStatusColor()
    : qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED
    ? COLORS.ORANGE_2
    : COLORS.GRAY_2

export const MainApp = () => {
  const inset = useSafeArea()
  const { qrData, qrState } = useSelfQR()
  const { beaconLocationName, isBluetoothOn } = useContactTracer()
  const [location, setLocation] = useState('')
  const popupRef = useRef<NotificationPopup | any>()
  const activeDotAnim = useRef(new Animated.Value(0)).current
  const { vaccineList, getVaccineUserName } = useVaccine()
  const [{ updateProfileDate, changeCount, card }] = useApplicationState()

  const windowWidth = Dimensions.get('window').width

  const [triggerGps, setTriggerGps] = useState<number>(0)
  const gpsRef = React.useRef({ triggerGps })

  React.useEffect(() => {
    const updateGPS = async () => {
      const status = await GPSState.getStatus()

      if (gpsRef.current.triggerGps !== status) {
        gpsRef.current.triggerGps = status

        setTriggerGps(status)
      }
    }

    updateGPS()
    const timer = setInterval(updateGPS, 2000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setLocation(beaconLocationName.name)
    if (location && popupRef && popupRef.current) {
      popupRef.current.show({
        slideOutTime: 20 * 1000,
      })
    }
  }, [beaconLocationName, location])

  const startAnimated = useCallback(
    () =>
      Animated.timing(activeDotAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        activeDotAnim.setValue(0)
        startAnimated()
      }),
    [activeDotAnim],
  )

  useEffect(() => {
    pushNotification.requestPermissions()
    startAnimated()
  }, [startAnimated])

  const vac = vaccineList && vaccineList[0]
  let firstName = null
  let lastName = null
  if (vac) {
    const name = getVaccineUserName ? getVaccineUserName(vac) : ''
    const names = name.split(' ')

    lastName = names.pop() || ''
    firstName = names.join(' ')
  }

  let profileStyle = { justifyContent: firstName || lastName ? 'flex-start' : 'center' } as const

  const vaccineNumber = vaccineList?.length

  const generateCircularTransform = (
    snapshot = 500,
    radius = 50,
  ): [
    {
      translateX: Animated.AnimatedInterpolation
      translateY: Animated.AnimatedInterpolation
    },
  ] => {
    let target = 1.8 //per round
    let rounds = 5
    let snapshotPerRound = snapshot / rounds

    let k = snapshotPerRound / target
    const inputRangeX = []
    const outputRangeX = []
    var value = 0
    for (let i = 0; i <= snapshot; ++i) {
      value += (Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / snapshotPerRound) + 1) / k
      let move = Math.sin(value * Math.PI * 2) * radius
      inputRangeX.push(i / snapshot)
      outputRangeX.push(move)
    }

    const translateX = activeDotAnim.interpolate({
      inputRange: inputRangeX,
      outputRange: outputRangeX,
    })

    const inputRangeY = []
    const outputRangeY = []
    value = 0
    for (let i = 0; i <= snapshot; ++i) {
      value += (Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / snapshotPerRound) + 1) / k
      let move = -Math.cos(value * Math.PI * 2) * radius
      inputRangeY.push(i / snapshot)
      outputRangeY.push(move)
    }

    const translateY = activeDotAnim.interpolate({
      inputRange: inputRangeY,
      outputRange: outputRangeY,
    })

    return [{ translateX, translateY }]
  }

  const transform = generateCircularTransform()

  const containerStyle = {
    marginTop: inset.top,
    marginLeft: inset.left,
    marginRight: inset.right,
    backgroundColor: '#F9F9F9',
    flex: 1,
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={containerStyle}>
        <StatusBar barStyle='dark-content' backgroundColor={COLORS.WHITE} />
        <View style={styles.containerTop}>
          <View style={styles.containerHeader}>
            <View style={styles.iconStatusContainer}>
              <FontAwesome
                name='map-marker'
                color={triggerGps === 3 ? '#10A7DC' : '#C1C1C1'}
                size={24}
                style={styles.iconStatusButton}
              />
              <FontAwesome
                name='bluetooth-b'
                color={isBluetoothOn ? '#10A7DC' : '#C1C1C1'}
                size={24}
                style={styles.iconStatusButton}
              />
            </View>
          </View>
          <View style={[styles.profileHeader, profileStyle]}>
            <View style={styles.profileContainer}>
              {qrData && qrState && (
                <>
                  <Animated.View style={[{ transform }]}>
                    <UserActiveDot color={mapQrStatusColor(qrData, qrState)} />
                  </Animated.View>
                  <AvatarProfile
                    qr={qrData}
                    qrState={qrState}
                    changeCount={changeCount}
                    updateProfileDate={updateProfileDate}
                  />
                </>
              )}
            </View>
            <View style={styles.w100}>
              {firstName ? (
                <Text style={styles.firstNameText} numberOfLines={1}>
                  {firstName}
                </Text>
              ) : null}
              {lastName ? (
                <Text style={styles.lastNameText} numberOfLines={1}>
                  {lastName}
                </Text>
              ) : null}
              <View style={styles.w100}>
                {vaccineNumber ? <Text style={styles.vaccineText}>{vaccineNumber}</Text> : null}
              </View>
            </View>
          </View>
          {windowWidth && (
            <Carousel
              data={carouselItems}
              pageIndex={card || 0}
              setPageIndex={(index) => {
                applicationState.setData('card', index)
              }}
              renderItem={(index) => {
                switch (index) {
                  case 'qr':
                    return <QRCard key={index} />
                  case 'vaccine':
                    return <VaccineCard key={index} />
                  case 'wfh':
                    return <WorkFromHomeCard key={index} />
                }
                return <View />
              }}
            />
          )}
          <NotificationPopup
            ref={popupRef}
            renderPopupContent={(props) => <BeaconFoundPopupContent {...props} result={location} />}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  iconStatusContainer: { flexDirection: 'row', paddingTop: 16, height: 45 },
  iconStatusButton: { marginRight: 10 },
  containerTop: { flex: 1, flexDirection: 'column' },
  containerHeader: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 0,
    paddingLeft: 15,
    paddingRight: 15,
    height: 0,
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
  profileHeader: {
    height: 180,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    marginTop: 5,
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
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
  userActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 100 / 2,
    position: 'absolute',
    top: 45,
    left: 45,
  },
  firstNameText: {
    color: '#222222',
    fontFamily: FONT_BOLD,
    fontSize: 40,
    paddingTop: 3,
    width: '100%',
  },
  lastNameText: {
    color: '#222222',
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: 'normal',
    width: '100%',
  },
  w100: {
    width: '100%',
  },
  vaccineText: {
    fontFamily: FONT_BOLD,
    position: 'absolute',
    color: '#26C8FF',
    opacity: 0.2,
    fontSize: 135,
    right: 0,
    bottom: -40,
  },
  flex1: {
    flex: 1,
  },
})

const AvatarProfile = ({
  qr,
  qrState,
  changeCount,
  updateProfileDate,
}: {
  qr: SelfQR
  qrState: QR_STATE
  updateProfileDate?: string
  changeCount?: number
}) => {
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
      if (!exists) {
        resetTo({
          name: 'Onboarding',
        })
      }
    })
  }, [faceURI, resetTo])

  const buttonStyle = {
    position: 'absolute',
    bottom: Math.floor((4 / 100) * avatarWidth),
    right: Math.floor((4 / 100) * avatarWidth),
  } as const
  const navigation = useNavigation()

  const today = moment()
  const isSameWeek = today.isSame(updateProfileDate || new Date().toISOString(), 'weeks')
  const days = moment().endOf('weeks').diff(today, 'days')
  const isLock = (changeCount || 0) >= MAX_CHANGE_PROFILE_LIMIT && isSameWeek
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isLock) {
          Alert.alert(
            I18n.t('can_not_change_picture'),
            I18n.t('can_change_pic_again_in') + (days || 1) + I18n.t('day_s'),
          )
        } else {
          navigation.navigate('MainAppFaceCamera', {
            setUri: (uri: string) => {
              applicationState.setData2({
                changeCount: (changeCount || 0) + 1,
                updateProfileDate: new Date().toISOString(),
              })
              setFaceURI(uri)
            },
            // setUri: (uri) => {
            //   if (daySinceCreated >= 3) {
            //     Alert.alert(
            //       I18n.t('are_you_sure'),
            //       `${I18n.t(
            //         'after_changed_pic_you_will_not_be_able_to_change_until',
            //       )} ${DEFAULT_PERIODS} ${I18n.t('day_s_have_passed')}`,
            //       [
            //         { text: I18n.t('cancel'), style: 'cancel' },
            //         {
            //           text: I18n.t('confirm'),
            //           onPress: () => {
            //             onChange(uri)
            //           },
            //         },
            //       ],
            //     )
            //   } else {
            //     onChange(uri)
            //   }
            // },
          })
        }
      }}
    >
      <View>
        <CircularProgressAvatar
          key={qr ? qr.getCreatedDate() : 0}
          image={faceURI ? { uri: faceURI } : undefined}
          color={color}
          progress={100}
          width={avatarWidth}
        />
        <UpdateProfileButton width={Math.floor(avatarWidth / 4)} style={buttonStyle} onChange={setFaceURI} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const UserActiveDot: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      ...styles.userActiveDot,
      backgroundColor: color,
    }}
  />
)
