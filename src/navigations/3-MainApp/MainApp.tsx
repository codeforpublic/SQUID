import React, { useState, useEffect } from 'react'
import { MockScreen } from '../MockScreen'
import { CovidQRCode } from '../../components/QRCode'
import { COLORS, FONT_FAMILY } from '../../styles'
import { MyBackground } from '../../covid/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import AntdIcon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from 'react-navigation-hooks'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import AsyncStorage from '@react-native-community/async-storage'
import { WhiteBackground } from '../../components/WhiteBackground'
// const QRCode =

const STATUS_COLORS = {
  green: '#27C269',
  yellow: '#E5DB5C',
  orange: '#E18518',
  red: '#EC3131',
  DEFAULT: '#B4B5C1',
}

const MAX_SCORE = 1000

const covidData: QRData = {
  color: 'green', // green, yellow, orange, red
  gender: 'M', // M | F
  age: 25,
}

const GET_USER = gql`
  query {
    user @client {
      image
    }
  }
`
export const MainApp = () => {
  const navigation = useNavigation()
  const score = 900
  // const { data } = useQuery(GET_USER)
  const [faceURI, setFaceURI] = useState(null)
  useEffect(() => {
    AsyncStorage.getItem('faceURI').then(uri => {
      console.log('uri', uri)
      setFaceURI(uri)
    })
  }, [])

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
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <CircularProgressAvatar
            image={faceURI? { uri: faceURI }: void 0}
            color={STATUS_COLORS.green}
            progress={(score / MAX_SCORE) * 100}
          />
        </View>
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
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center',
              borderRightColor: COLORS.GRAY_1,
              borderRightWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <Image
              source={require('../../assets/covid.png')}
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
                ความเสี่ยง
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                ความเสี่ยงต่ำ
              </Text>
            </View>
          </View>
          <View
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
                    color: STATUS_COLORS.green,
                  }}
                >
                  {score}
                </Text>{' '}
                / {MAX_SCORE}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <CovidQRCode data={covidData} bgColor={COLORS.WHITE} />
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
