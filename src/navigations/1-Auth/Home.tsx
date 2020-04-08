import React from 'react'
import { Image, Text, View, StyleSheet, StatusBar, Alert } from 'react-native'
import { PrimaryButton } from '../../components/Button'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../styles'
import { Button } from 'react-native-elements'
import { DebugTouchable } from '../../components/DebugTouchable'
import { API_URL } from '../../config'
import CodePush from 'react-native-code-push'

export const Home = ({ navigation }) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.PRIMARY_DARK,
      }}
    >
      <StatusBar
        backgroundColor={COLORS.PRIMARY_DARK}
        barStyle="light-content"
      />
      <View style={styles.content}>
        <DebugTouchable
          onDebug={() => {
            CodePush.getUpdateMetadata().then(result => {
              Alert.alert(API_URL, JSON.stringify(result))
            })
          }}
        >
          <Image
            source={require('../../assets/Logo.png')}
            resizeMode="contain"
            style={{ width: 300 }}
          />
        </DebugTouchable>
        <Text style={styles.description}>
          ร่วมโหลด ร่วมใช้ ร่วมใจ{'\n'}
          พิชิตโควิด-19
        </Text>
        <PrimaryButton
          title="ลงทะเบียน"
          titleStyle={{
            color: '#00A0D7',
            width: 240,
          }}
          buttonStyle={{
            backgroundColor: 'white',            
          }}
          onPress={async () => {
            navigation.navigate('AgreementPolicy')
          }}
        />
      </View>
    </View>
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
    fontFamily: FONT_BOLD,
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  description: {
    marginTop: 20,
    width: 262,
    marginBottom: 82,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    textAlign: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  button: {},
})
