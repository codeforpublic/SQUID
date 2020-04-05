import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import { WhiteBackground } from '../../components/WhiteBackground'
import Sizer from 'react-native-size'
import { userPrivateData } from '../../state/userPrivateData'
import { useSelfQR, QR_STATE } from '../../state/qr'
import { applicationState } from '../../state/app-state'
import { Link } from '../../components/Base'
import { useResetTo } from '../../utils/navigation'
import { useNavigation } from 'react-navigation-hooks'
import { pushNotification } from '../../services/notification'
import { DebugTouchable } from '../../components/DebugTouchable'
import { backgroundTracking } from '../../services/background-tracking'
import FeatureIcon from 'react-native-vector-icons/Feather'
import { Camera } from '../../components/Camera'
import { SelfieCaptureGuideline } from '../../components/SelfieCaptureGuideline'
import RNFS from 'react-native-fs'
import moment from 'moment-timezone'
import 'moment/locale/th'

const MAX_SCORE = 100

const QRStateText = ({ qrState, refreshQR }) => {
  const navigation = useNavigation()

  switch (qrState) {
    case QR_STATE.FAILED:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={refreshQR}
          style={styles.qrOverlay}
        >
          <Text
            style={{
              color: COLORS.GRAY_4,
              fontSize: 24,
              fontFamily: FONT_FAMILY,
            }}
          >
            ไม่สามารถสร้าง QR ได้
          </Text>
          <Text
            style={{
              color: COLORS.GRAY_4,
              fontFamily: FONT_FAMILY,
            }}
          >
            เชื่อมต่ออินเทอร์เน็ตเพื่อสร้าง QR
          </Text>
          <Text style={{
            color: '#02A0D7',
            fontFamily: FONT_FAMILY,
            textAlign: 'center',
            textDecorationLine: 'underline',
          }}>
            ลองอีกครั้ง
          </Text>
        </TouchableOpacity>
      )
    case QR_STATE.LOADING:
      return (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <ActivityIndicator size="large" color="black" />
        </View>
      )
    case QR_STATE.EXPIRE:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={refreshQR}
          style={styles.qrOverlay}
        >
          <Text
            style={{
              color: 'red',
              fontSize: 24,
              fontFamily: FONT_FAMILY,
            }}
          >
            QR หมดอายุแล้ว
          </Text>
          <Text
            style={{
              color: 'red',
              fontFamily: FONT_FAMILY,
            }}
          >
            เชื่อมต่ออินเทอร์เน็ตเพื่ออัพเดท
          </Text>
          <Text style={{
            color: '#02A0D7',
            fontFamily: FONT_FAMILY,
            textAlign: 'center',
            textDecorationLine: 'underline',
          }}>
            ลองอีกครั้ง
          </Text>
        </TouchableOpacity>
      )
    case QR_STATE.NOT_VERIFIED:
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            const phone = userPrivateData.getMobileNumber()
            if (phone) {
              navigation.navigate({
                routeName: 'AuthOTP',
                params: { phone: phone.replace(/-/g, '') },
              })
            } else {
              navigation.navigate('AuthPhone')
            }
          }}
          style={styles.qrOverlay}
        >
          <View>
            <Text
              style={{
                color: COLORS.BLACK_1,
                fontSize: 20,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              ยืนยันเบอร์โทรศัพท์
            </Text>
            <Text
              style={{
                color: COLORS.BLACK_1,
                fontFamily: FONT_FAMILY,
                textAlign: 'center',
              }}
            >
              ด้วยรหัสจาก SMS ก่อนนะครับ
            </Text>
            <Text style={{
              color: '#02A0D7',
              fontFamily: FONT_FAMILY,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}>
              กดเพื่อรับหรัส
            </Text>
          </View>
        </TouchableOpacity>
      )
    default:
      return null
  }
}

const Label = ({ label }) => {
  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: '#0C2641',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'center',
      }}
    >
      <Text style={{ color: 'white', fontFamily: FONT_FAMILY }}>{label}</Text>
    </View>
  )
}

export const MainApp = () => {
  const [faceURI, setFaceURI] = useState(userPrivateData.getFace())  
  const { qrData, qrState, error, refreshQR } = useSelfQR()
  const resetTo = useResetTo()
  const navigation = useNavigation()

  const avatarWidth = Math.min(
    200,
    Math.floor((20 / 100) * Dimensions.get('screen').height),
  )

  const navigateToMainAppFaceCamera = () => {
    navigation.navigate('MainAppFaceCamera', { setUri: setFaceURI })
  }

  const changeImageWidth = Math.floor(avatarWidth / 6)

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
  const progress = qr ? (qr.getScore() / MAX_SCORE) * 100 : 0
  const color = qr ? qr.getStatusColor() : qrState === QR_STATE.NOT_VERIFIED? COLORS.ORANGE_2 : COLORS.GRAY_2
  const qrUri = qr ? qr.getQRImageURL() : ''
  const label = qr ? qr.getLabel() : qrState === QR_STATE.NOT_VERIFIED? 'ยังไม่ทราบความเสี่ยง': null

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.PRIMARY_LIGHT}
      />
      <DebugTouchable
        onDebug={() => {
          backgroundTracking.toggleDebug()
        }}
      >
        <View style={{ alignItems: 'flex-start', marginLeft: 30 }}>
          <Image
            source={require('../../assets/logo_header.png')}
            resizeMode="contain"
            style={{
              height: 50,
              width: 50 * (260 / 140),
              marginTop: 8,
              marginBottom: 12,
            }}
          />
        </View>
      </DebugTouchable>
      <TouchableWithoutFeedback>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
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
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={navigateToMainAppFaceCamera}
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                width: changeImageWidth,
                height: changeImageWidth,
                borderRadius: Math.floor(changeImageWidth / 2),
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 4,
                bottom: Math.floor((8 / 100) * avatarWidth),
                right: Math.floor((8 / 100) * avatarWidth),
              }}
            >
              <FeatureIcon
                name="camera"
                size={Math.floor((60 / 100) * changeImageWidth)}
              />
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {qr && qr.getProficientLabel() ? (
        <Label label={qr.getProficientLabel()} />
      ) : (
        void 0
      )}
      
        <Animated.Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 16,
            alignSelf: 'center',
            color: COLORS.GRAY_4,
            marginTop: 16,
            marginBottom: 4,
          }}
        >
          {qr? `ข้อมูลวันที่ ${qr.getCreatedDate().format('DD MMM HH:mm น.')}`: `วันที่ ${moment().format('DD MMM HH:mm น.')}`}
        </Animated.Text>
      
      {qrState === QR_STATE.OUTDATE ? (
        <Text
          style={{
            color: '#DCC91B',
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            marginTop: -4,
            marginBottom: 8,
            alignSelf: 'center',
          }}
        >
          * QR ไม่ได้อัพเดทเป็นเวลา {Math.floor(timeSinceLastUpdate / 60000)}{' '}
          นาที
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          justifyContent: 'center',
        }}
      >
        {label ? (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center'
            }}
          >
            <View
              style={{
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  marginTop: -4,
                  fontWeight: 'bold',
                  color,
                }}
              >
                {label}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
      <Sizer
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          backgroundColor: COLORS.WHITE,
          borderColor: COLORS.GRAY_1,
          borderStyle: 'solid',
        }}
      >
        {({ height }) => {
          const size = height ? Math.min(300, height) : void 0
          const qrPadding = (20 / 300) * size
          return size ? (
            <Fragment>
              {qr ? (
                <Image
                  style={{
                    width: size,
                    height: size,
                    opacity: qrState === QR_STATE.EXPIRE ? 0.1 : 1,
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
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
    borderColor: '#0C2641'
  }
})
