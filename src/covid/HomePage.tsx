import React from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native'
import { PrimaryButton } from './Button'
import { AppContext } from '../AppContext'
import { Icon } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from '../styles'
import { MyBackground } from './MyBackground'
import { DEFAULT_APPLICATION_ID } from './const'
import { NavigationActions, StackActions } from 'react-navigation'
import BackgroundGeolocation from 'react-native-background-geolocation'
import { useHUD } from '../HudView'

export const HomePage = ({ navigation }) => {
  const { showSpinner, hide } = useHUD()
  return (
    <AppContext.Consumer>
      {({ activateBackgroundTracking }) => (
        <MyBackground variant="home">
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          >
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
              <Image
                source={require('./Logo.png')}
                style={{ height: 80 }}
                resizeMode="contain"
              />
              <Text style={styles.title}>ทำไมต้อง Squid ?</Text>
              <View style={styles.description}>
                <Text style={styles.descriptionText}>
                  ด้วยความที่ตัวเองมีโอกาสเสี่ยง
                </Text>
                <Text style={styles.descriptionText}>
                  เราอยากเป็นอีกแรงช่วยสังคม
                </Text>
                <Text style={styles.descriptionText}>
                  ในการป้องกัน การแพร่ระบาด
                </Text>
                <Text style={styles.descriptionText}>
                  และ ทำตาม พรบ โรคติดต่อ
                </Text>
              </View>
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
                  // showSpinner()
                  // try {
                  //   await BackgroundGeolocation.requestPermission()
                  //   console.log('[requestPermission] SUCCESS')
                  // } catch (status) {
                  //   console.log('[requestPermission] REJECTED', status)
                  // }
                  // activateBackgroundTracking()
                  // hide()
                  const action = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: 'PermissionOnboardingScreen',
                      }),
                    ],
                    key: null,
                  })
                  navigation.dispatch(action)
                }}
              />
            </View>
          </View>
        </MyBackground>
      )}
    </AppContext.Consumer>
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
    fontWeight: 'normal',
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
  description: {
    marginTop: 20,
    width: 262,
    marginBottom: 82,
  },
  descriptionText: {
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
