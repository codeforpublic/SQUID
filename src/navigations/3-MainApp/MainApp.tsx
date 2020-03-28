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
} from 'react-native'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import { useNavigation } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage'
import { WhiteBackground } from '../../components/WhiteBackground'

const STATUS_COLORS = {
  green: '#27C269',
  yellow: '#E5DB5C',
  orange: '#E18518',
  red: '#EC3131',
  DEFAULT: '#B4B5C1',
}

const MAX_SCORE = 1000

const mocks = [
  { color: 'green', score: 900, risk: 'ความเสี่ยงต่ำ' },
  { color: 'yellow', score: 500, risk: 'เฝ้าระวัง' },
  { color: 'red', score: 200, risk: 'ความเสี่ยงสูง' },
]

export const MainApp = () => {
  const navigation = useNavigation()
  const [mock, setMock] = useState(null)
  const tap = useRef([])
  useEffect(() => {
    AsyncStorage.getItem('mock').then(color => {
      setMock(mocks.find(mock => mock.color === color) || mocks[0])
    })
  }, [])
  
  const [faceURI, setFaceURI] = useState(null)
  useEffect(() => {
    AsyncStorage.getItem('faceURI').then(uri => {
      console.log('uri', uri)
      setFaceURI(uri)
    })
  }, [])
  

  const pressImage = () => {
    const tapList = tap.current
    console.log(tapList)
    tapList.push(Date.now())
    if (tapList.length > 5) {
      tapList.splice(0, 1)
    }
    if (tapList[4] - tapList[0] < 2000) {
      const nextColor =
        mock.color === 'green'
          ? 'yellow'
          : mock.color === 'yellow'
          ? 'red'
          : 'green'
      AsyncStorage.setItem('mock', nextColor)
      setMock(mocks.find(mock => mock.color === nextColor) || mocks[0])
      tapList.splice(0, 5)
    }
  }
  if (!faceURI) {
    return null
  }
  if (!mock) return null
  const covidData: QRData = {
    color: mock.color, // green, yellow, orange, red
    gender: 'M', // M | F
    age: 25,
  }  

  return (
    <WhiteBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
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
        <TouchableWithoutFeedback onPress={pressImage}>
          <View
            style={{
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <CircularProgressAvatar
              image={faceURI ? { uri: faceURI } : void 0}
              color={STATUS_COLORS[mock.color]}
              progress={(mock.score / MAX_SCORE) * 100}              
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
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center',
              // borderRightColor: COLORS.GRAY_1,
              // borderRightWidth: 1,
              // borderStyle: 'solid',
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
                {mock.risk}
              </Text>
            </View>
          </View>
          {/* <View
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../assets/home.png')}
              style={{ width: 24, height: 24 }}
            />
            <View
              style={{
                flex: 1,
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
                คะแนน
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                <Text
                  style={{
                    color: STATUS_COLORS[mock.color],
                  }}
                >
                  {mock.score}
                </Text>{' '}
                / {MAX_SCORE}
              </Text>
            </View>
          </View> */}
        </View>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: COLORS.GRAY_1,
          }}
        >
          <CovidQRCode
            data={covidData}
            bgColor={COLORS.GRAY_1}
            size={200}
          />
        </View>
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
