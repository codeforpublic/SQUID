import React, { useEffect } from 'react'
import { Linking, Alert, Platform } from 'react-native'

export const withEnforceUpdate = isEnforced => Component => props => {
  useEffect(() => {
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
  }, [])
  if (isEnforced) {
    return null
  }
  return <Component {...props} />
}
