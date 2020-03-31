import React, { useEffect, useState, useRef } from 'react'
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
import { useSelfQR } from '../../state/qr'
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

const MAX_SCORE = 100

export const MainApp = () => {
  const [faceURI, setFaceURI] = useState(userPrivateData.getFace())
  const isVerified = applicationState.get('isRegistered')
  const qr = useSelfQR()
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
  // useEffect(() => {
  //   fadeAnim.setValue(0)
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 5000,
  //   }).start()
  // }, [qr])

  if (!qr) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
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
              key={qr.getCreatedDate()}
              image={faceURI ? { uri: faceURI } : void 0}
              color={qr.getStatusColor()}
              progress={(qr.getScore() / MAX_SCORE) * 100}
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
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingBottom: 6,
          justifyContent: 'center',
        }}
      >
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
                color: qr.getStatusColor(),
              }}
            >
              {qr.getLabel()}
            </Text>
          </View>
        </View>
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
            <Image
              style={{ width: size, height: size }}
              source={{
                uri: qr.getQRImageURL(),
              }}
            />
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
