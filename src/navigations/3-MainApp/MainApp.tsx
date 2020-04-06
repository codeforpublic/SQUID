import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useSafeArea } from 'react-native-safe-area-context'
import {
  Animated,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  Alert,
} from 'react-native'
import FeatureIcon from 'react-native-vector-icons/Feather'
import RNFS from 'react-native-fs'
import moment from 'moment-timezone'
import 'moment/locale/th'
import { QRStateText } from './QRStateText'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import Sizer from 'react-native-size'
import { userPrivateData } from '../../state/userPrivateData'
import { useSelfQR, QR_STATE } from '../../state/qr'
import { useResetTo } from '../../utils/navigation'
import { useNavigation } from 'react-navigation-hooks'
import { pushNotification } from '../../services/notification'
import { DebugTouchable } from '../../components/DebugTouchable'
import { UpdateProfileButton } from './UpdateProfileButton'
import { backgroundTracking } from '../../services/background-tracking'
import Color from 'color'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Footer = ({ date = moment().locale('th') }) => {
  const smallDevice = Dimensions.get('window').height < 600
  // const time = useTimer()
  return (
    <DebugTouchable
      onDebug={() => {
        backgroundTracking.toggleDebug()
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ marginRight: 12 }}>
          
          <Text
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: smallDevice ? 12 : 14,
              textAlign: 'right',
            }}
          >
            ตรวจโดยแอปพลิเคชัน
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: smallDevice ? 12 : 14,
              color: '#02A0D7',
              opacity: 0.9,
              textAlign: 'right',
            }}
          >
            วันที่ {date.format('D MMMM​')} พ.ศ. {date.year() + 543}
          </Text>
        </View>
        <Image
          source={require('../../assets/logo_header.png')}
          resizeMode="contain"
          style={{
            height: smallDevice ? 30 : 40,
            width: (smallDevice ? 30 : 40) * (260 / 140),
          }}
        />
      </View>
    </DebugTouchable>
  )
}
const PROFICIENT_BG = '#0C2641'
const ProficientLabel = ({ label }) => {
  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: PROFICIENT_BG,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderColor: COLORS.WHITE,
        borderWidth: 1,
        alignSelf: 'center',
      }}
    >
      <Text style={{ color: 'white', fontFamily: FONT_FAMILY }}>{label}</Text>
    </View>
  )
}

const useTimer = () => {
  const [time, setTime] = useState(60 * 5)
  useEffect(() => {
    let it = setTimeout(() => {
      if (time === 0) {
        setTime(60 * 5)
        return
      }
      setTime(time - 1)
    }, 1000)
    return () => clearTimeout(it)
  }, [time])
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return (
    (minutes > 9 ? minutes : '0' + minutes) +
    ':' +
    (seconds > 9 ? seconds : '0' + seconds)
  )
}


export const MainApp = () => {
  const inset = useSafeArea()
  const [faceURI, setFaceURI] = useState(userPrivateData.getFace())
  const { qrData, qrState, error, refreshQR } = useSelfQR()
  const resetTo = useResetTo()
  const navigation = useNavigation()

  const avatarWidth = Math.min(
    200,
    Math.floor((20 / 100) * Dimensions.get('screen').height),
  )


  useEffect(() => {
    pushNotification.configure()
  }, [])
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

  const qr = qrData
  const timeSinceLastUpdate = qr ? Date.now() - qr.timestamp : 0
  const progress = qr ? (qr.getScore() / 100) * 100 : 0
  const color = qr
    ? qr.getStatusColor()
    : (qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED)
    ? COLORS.ORANGE_2
    : COLORS.GRAY_2
  const qrUri = qr ? qr.getQRImageURL() : ''
  const label = qr
    ? qr.getLabel()
    : qrState === QR_STATE.NOT_VERIFIED
    ? 'ยังไม่ทราบความเสี่ยง'
    : qrState === QR_STATE.LOADING
    ? 'รอสักครู่...'
    : qrState === QR_STATE.FAILED
    ? 'เกิดข้อผิดพลาด'
    : ''
  const proficientLabel = qr && qr.getProficientLabel()

  return (
    <View
      style={[styles.container, { paddingTop: inset.top, paddingBottom: 12 }]}
    >
      <StatusBar
        barStyle={proficientLabel ? 'light-content' : 'dark-content'}
        backgroundColor={
          proficientLabel ? COLORS.BLACK_1 : COLORS.PRIMARY_LIGHT
        }
      />
      {qr && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: proficientLabel
                ? PROFICIENT_BG
                : Color(qr.getStatusColor()).alpha(0.1).toString(),
              height: '50%',
            },
          ]}
        />
      )}
      <TouchableWithoutFeedback>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
            marginTop: 20,
          }}
        >
          <View style={{ position: 'relative' }}>
            <CircularProgressAvatar
              key={qr ? qr.getCreatedDate() : 0}
              image={faceURI ? { uri: faceURI } : void 0}
              color={color}
              progress={progress}
              width={avatarWidth}
            />
            <UpdateProfileButton width={Math.floor(avatarWidth / 6)} style={{
              position: 'absolute',
              bottom: Math.floor((8 / 100) * avatarWidth),
              right: Math.floor((8 / 100) * avatarWidth),
            }} onChange={setFaceURI}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {proficientLabel ? <ProficientLabel label={proficientLabel} /> : void 0}
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
            source={require('./morchana.png')}
            style={{
              marginRight: 10,
            }}
            resizeMode="contain"
          />
          <View>
            {label ? (
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  marginTop: 12,
                  fontWeight: 'bold',
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
                  fontSize: 14,
                  alignSelf: 'center',
                }}
              >
                ไม่ได้อัพเดทเป็นเวลา {Math.floor(timeSinceLastUpdate / 60000)}{' '}
                นาที
              </Text>
            ) : qr ? (
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  alignSelf: 'center',
                  color: COLORS.GRAY_4,
                }}
              >
                {`อัพเดทล่าสุด ${qr.getCreatedDate().format('HH:mm น.')}`}
              </Text>
            ) : (
              void 0
            )}
          </View>
          {qr || qrState !== QR_STATE.LOADING ? (
            <TouchableOpacity onPress={refreshQR}>
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
      <Sizer
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          backgroundColor: COLORS.WHITE,
          borderColor: COLORS.GRAY_1,
          borderStyle: 'solid',
          maxHeight: 320,
        }}
      >
        {({ height }) => {
          const size = height ? Math.min(320, height) : void 0
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
                    opacity: 0.1,
                  }}
                  source={require('../../assets/qr-placeholder.png')}
                />
              )}
              <QRStateText qrState={qrState} refreshQR={refreshQR} />
            </Fragment>
          ) : (
            <ActivityIndicator size="large" />
          )
        }}
      </Sizer>
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  text: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 32,
    marginLeft: 8,
    color: COLORS.PRIMARY_LIGHT,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.RED,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderWidth: 3,
    borderColor: '#0C2641',
  },
})
