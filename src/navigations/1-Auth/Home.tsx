import React from 'react'
import { Image, Text, View, StyleSheet, StatusBar, Alert } from 'react-native'
import { PrimaryButton } from '../../components/Button'
import { COLORS, FONT_FAMILY } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { NavigationActions, StackActions } from 'react-navigation'
import { DebugTouchable } from '../../components/DebugTouchable'
import { API_URL } from '../../config'
import CodePush from 'react-native-code-push'

export const Home = ({ navigation }) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#212356',
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
