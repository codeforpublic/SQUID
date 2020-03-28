import React, { useState, useEffect, useRef } from 'react'
import { CovidQRCode } from '../../components/QRCode'
import { COLORS, FONT_FAMILY } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import { useNavigation } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage'
import { WhiteBackground } from '../../components/WhiteBackground'
import Sizer from 'react-native-size'
import { userPrivateData } from '../../state/userPrivateData'
import { useQRData } from '../../state/qr'

const STATUS_COLORS = {
  green: '#27C269',
  yellow: '#E5DB5C',
  orange: '#E18518',
  red: '#EC3131',
  DEFAULT: '#B4B5C1',
}
const LEVELS = {
  green: 1,
  yellow: 2,
  orange: 3,
  red: 4,
}
const SCORES = {
  green: 100,
  yellow: 80,
  orange: 50,
  red: 30,
}
const LABELS = {
  green: 'ความเสี่ยงต่ำ',
  orange: 'ความเสี่ยงปานกลาง',
  yellow: 'ความเสี่ยงสูง',
  red: 'ความเสี่ยงสูงมาก',
}

const MAX_SCORE = 100

export const MainApp = () => {
  const faceURI = userPrivateData.getData('faceURI')
  const qrData = useQRData()
  if (!qrData) {
    return null
  }
  console.log('qrData.qr.base64', 'data:image/png;base64,' + qrData.qr.base64)

  return (
    <WhiteBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.PRIMARY_DARK}
        />
        <Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            alignSelf: 'center',
            color: COLORS.PRIMARY_DARK,
            marginVertical: 16,
          }}
        >
          ข้อมูลของฉัน
        </Text>
        <TouchableWithoutFeedback>
          <View
            style={{
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <CircularProgressAvatar
              image={faceURI ? { uri: faceURI } : void 0}
              color={STATUS_COLORS[qrData.data.code]}
              progress={(SCORES[qrData.data.code] / MAX_SCORE) * 100}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            alignSelf: 'center',
            color: COLORS.GRAY_2,
            marginVertical: 16,
          }}
        >
          ข้อมูลวันที่ 26 มี.ค. 2563 16:45 น.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomColor: COLORS.GRAY_1,
            borderBottomWidth: 1,
            borderStyle: 'solid',
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
              style={{ width: 24, height: 24 }}
            />
            <View
              style={{
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginLeft: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  color: COLORS.GRAY_2,
                }}
              >
                ความเสี่ยง
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                {LABELS[qrData.data.code]}
              </Text>
            </View>
          </View>
        </View>
        <Sizer
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: COLORS.GRAY_1,
          }}
        >
          {({ height }) =>
            qrData.qr.base64 && height ? (
              <Image                
                style={{ width: height - 20, height: height - 20 }}
                source={{
                  uri: 'data:image/png;base64,' + qrData.qr.base64,
                }}
              />
            ) : (
              <ActivityIndicator size="large" />
            )
          }
        </Sizer>
      </SafeAreaView>
    </WhiteBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
