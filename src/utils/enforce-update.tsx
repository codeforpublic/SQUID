import React, { useEffect } from 'react'
import {
  Linking,
  Alert,
  Platform,
  AppState,
  View,
  StyleSheet,
} from 'react-native'

export const withEnforceUpdate = isEnforced => Component => props => {
  useEffect(() => {
    const check = () => {
      if (isEnforced) {
        Alert.alert(
          'อัพเดทสำคัญ',
          'กรุณาอัพเดทเวอร์ชั่นล่าสุดจาก' +
            (Platform.OS === 'ios' ? 'App Store' : 'Play Store'),
          [
            {
              text: 'ตกลง',
              onPress: async () => {
                const url =
                  Platform.OS === 'ios'
                    ? 'https://apps.apple.com/th/app/allthaialert/id1505185420'
                    : 'https://play.google.com/store/apps/details?id=com.thaialert.app'

                await Linking.openURL(url)
              },
            },
          ],
        )
      }
    }
    let prevState
    AppState.addEventListener('change', state => {
      if (state === 'active' && prevState !== state) {
        check()
      }
      prevState = state
    })
    check()
  }, [])
  if (isEnforced) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#00A0D7',
          },
        ]}
      />
    )
  }
  return <Component {...props} />
}
