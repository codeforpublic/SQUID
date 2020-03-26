import React from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { PrimaryButton } from '../../components/Button'
import { COLORS, FONT_FAMILY } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { NavigationActions, StackActions } from 'react-navigation'

export const Home = ({ navigation }) => {
  return (
      <MyBackground variant="home">
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        >
          <StatusBar barStyle="light-content" />
          <View style={styles.content}>
            <Image
              source={require('../../assets/Logo.png')}            
              resizeMode="contain"
            />
            <Text style={styles.title}>หยุดเชื้อ เพื่อชาติ</Text>
            <Text style={styles.description}>
            ด้วยความที่ตัวเองมีโอกาสเสี่ยง{"\n"}
            เราอยากเป็นอีกแรงช่วยสังคม{"\n"}
            ในการป้องกัน การแพร่ระบาด{"\n"}
            และ ทำตาม พรบ โรคติดต่อ
            </Text>
            <PrimaryButton
              title="เริ่มต้น"
              iconRight
              icon={{
                name: 'right',
                type: 'antdesign',
                color: 'white',
                size: 18,
              }}
              onPress={async () => {
                navigation.navigate('AgreementPolicy')
              }}
            />
          </View>
        </View>
      </MyBackground>      
  )
}

const styles = StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 60,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
  description: {
    marginTop: 20,
    width: 262,
    marginBottom: 82,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
  button: {},
})
