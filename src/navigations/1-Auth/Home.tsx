import React from 'react'
import { Image, Text, View, StyleSheet, StatusBar } from 'react-native'
import { PrimaryButton } from '../../components/Button'
import { COLORS, FONT_FAMILY } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { NavigationActions, StackActions } from 'react-navigation'

export const Home = ({ navigation }) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#212356',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Image source={require('../../assets/Logo.png')} resizeMode="contain" style={{width: 300}} />
        <Text style={styles.description}>
          หยุดเชื้อเพื่อชาติ{'\n'}
          ป้องกันการระบาดของโรค
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
    color: COLORS.PRIMARY_LIGHT,
  },
  description: {
    marginTop: 20,
    width: 262,
    marginBottom: 82,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  button: {},
})
