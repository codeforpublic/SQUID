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
} from 'react-native'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import AntdIcon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from 'react-navigation-hooks'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import AsyncStorage from '@react-native-community/async-storage'
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
    <MyBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            alignItems: 'center',
            marginVertical: 16,
            position: 'relative',
          }}
        >
          <TouchableOpacity
            style={{ position: 'absolute', right: 24, top: 0 }}
            onPress={() => {
              navigation.navigate('QRCodeScan')
            }}
          >
            <AntdIcon name="scan1" color={COLORS.PRIMARY_LIGHT} size={32} />
          </TouchableOpacity>
          <CircularProgressAvatar
            text="เสี่ยงน้อย"
            image={faceURI? { uri: faceURI }: ''}
            color={STATUS_COLORS.green}
            progress={(score / MAX_SCORE) * 100}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 24,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Text
              style={{
                color: COLORS.WHITE,
                fontFamily: FONT_FAMILY,
                fontStyle: 'normal',
                fontSize: 16,
              }}
            >
              คะแนน
            </Text>
            <Text
              style={{
                color: COLORS.GRAY_2,
                fontFamily: FONT_FAMILY,
                fontStyle: 'normal',
                fontSize: 16,
              }}
            >
              <Text
                style={{
                  color: STATUS_COLORS.green,
                  fontFamily: FONT_FAMILY,
                  fontStyle: 'normal',
                  fontSize: 32,
                  fontWeight: 'bold',
                }}
              >
                {score}
              </Text>{' '}
              / {MAX_SCORE}
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.GRAY_2,
              fontFamily: FONT_FAMILY,
              fontStyle: 'normal',
              fontSize: 16,
            }}
          >
            คะแนนของคุุณจะลดลงหากคุณเดินทางไปในพื้นที่เสี่ยง
          </Text>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 60 }}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontFamily: FONT_FAMILY,
              fontStyle: 'normal',
              fontSize: 16,
              marginBottom: 24,
            }}
          >
            QR ของฉัน
          </Text>
          <CovidQRCode data={covidData} bgColor={COLORS.PRIMARY_DARK} />
        </View>
      </SafeAreaView>
    </MyBackground>
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
