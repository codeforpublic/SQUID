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

const MAX_SCORE = 100

const QRStateText = ({ qrState }) => {
  switch (qrState) {
    case QR_STATE.INITIAL:
      return (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 12,
          }}
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
        </View>
      )
    case QR_STATE.EXPIRE:
      return (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 12,
          }}
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
        </View>
      )
    default:
      return null
  }
}

export const MainApp = () => {
  const [faceURI, setFaceURI] = useState(userPrivateData.getFace())
  const isVerified = applicationState.get('isRegistered')
  const { qrData, qrState, error } = useSelfQR()
  const resetTo = useResetTo()
  const navigation = useNavigation()
  const [fadeAnim] = useState(new Animated.Value(0))

  const avatarWidth = Math.min(
    200,
    Math.floor((25 / 100) * Dimensions.get('screen').height),
  )

  const navigateToMainAppFaceCamera = () => {
    navigation.navigate('MainAppFaceCamera', { setUri: setFaceURI })
  }

  const changeImageWidth = Math.floor(avatarWidth / 6)

  useEffect(() => {
    pushNotification.configure()
  }, [])
  useEffect(() => {
    RNFS.exists(faceURI).then(exists => {
      console.log('exists', exists)
      if (!exists) {
        applicationState.set('isPassedOnboarding', false)
        resetTo({
          routeName: 'Onboarding',
        })
      }
    })
  }, [])
  // useEffect(() => {
  //   fadeAnim.setValue(0)
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 5000,
  //   }).start()
  // }, [qr])

  if (!qrData && !error) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const qr = qrData
  const timeSinceLastUpdate = qr ? Date.now() - qr.timestamp : 0
  const progress = qr ? (qr.getScore() / MAX_SCORE) * 100 : 0
  const color = qr ? qr.getStatusColor() : COLORS.GRAY_2
  const qrUri = qr ? qr.getQRImageURL() : ''
  const label = qr ? qr.getLabel() : ''
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
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/logo_header.png')}
            resizeMode="contain"
            style={{ height: 32, marginTop: 8, marginBottom: 4 }}
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
      {qr ? (
        <Animated.Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 18,
            alignSelf: 'center',
            // color: fadeAnim.interpolate({
            //   inputRange: [0, 0.1, 0.9, 1],
            //   outputRange: [
            //     'rgb(80, 85, 101)',
            //     'rgb(231,137,51)',
            //     'rgb(231, 73, 51)',
            //     'rgb(80, 85, 101)',
            //   ],
            // }),
            color: COLORS.GRAY_4,
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          ข้อมูลวันที่ {qr.getCreatedDate().format('DD MMM YYYY HH:mm น.')}
        </Animated.Text>
      ) : null}
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
          paddingBottom: 6,
          justifyContent: 'center',
        }}
      >
        {qr ? (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/covid.png')}
              style={{ width: 20, height: 20 }}
            />
            <View
              style={{
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginLeft: 8,
              }}
            >
              {/* <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  color: COLORS.GRAY_2,
                }}
              >
                ความเสี่ยง
              </Text> */}
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
          // borderBottomWidth: 1,
          // borderTopWidth: 1,
          borderStyle: 'solid',
        }}
      >
        {({ height }) => {
          const size = height ? Math.min(300, height) : void 0
          return size ? (
            <Fragment>
              {qr ? (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri: qrUri,
                  }}
                />
              ) : (
                <Image
                  style={{ width: size, height: size, opacity: 0.1 }}
                  source={require('../../assets/qr-placeholder.png')}
                />
              )}
              <QRStateText qrState={qrState} />
            </Fragment>
          ) : (
            <ActivityIndicator size="large" />
          )
        }}
      </Sizer>
      {isVerified ? (
        void 0
      ) : (
        <TouchableOpacity
          onPress={() => {
            applicationState.set('skipRegistration', false)
            resetTo({
              routeName: 'Auth',
            })
            setTimeout(() => {
              navigation.navigate('AuthPhone')
            }, 0)
          }}
          style={{
            paddingBottom: 4,
            // backgroundColor: COLORS.PRIMARY_LIGHT
          }}
        >
          <Link style={{ fontWeight: 'bold' }}>ยืนยันตัวตน ></Link>
        </TouchableOpacity>
      )}
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
})
