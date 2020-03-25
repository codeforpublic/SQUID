import React, { useEffect, useState } from 'react'
import {
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Icon } from 'react-native-elements'
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions'
import { COLORS, FONT_FAMILY } from '../styles'
import { RectButton } from './Button'
import useAppState from 'react-native-appstate-hook'

const MissingPermissionsAlert = ({
  onPress,
}: {
  onPress: (event: Event) => void
}) => {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <View
      style={{
        backgroundColor: COLORS.ORANGE,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 30,
        position: 'relative',
      }}
    >
      <Text style={{
          fontSize: 20,
          fontFamily: FONT_FAMILY,
          fontStyle: 'normal',
          fontWeight: 'normal',
          lineHeight: 24,
          color: 'white',
          marginBottom: 20,
        }}>
        คุณไม่ได้เปิดสิทธิการเข้าถึงข้อมูลสถานที่
      </Text>
      <TouchableWithoutFeedback onPress={() => setDismissed(true)}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 16,
          }}
        >
          <Icon name="close" type="antdesign" color="white" />
        </View>
      </TouchableWithoutFeedback>
      <RectButton
        onPress={onPress}
        title="เปิดสิทธิ"
        style={{ width: '100%' }}
      />
    </View>
  )
}

export const MissingPermissionsAlertHandler = () => {
  const { appState } = useAppState()
  const PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  })
  const [component, setComponent] = useState<JSX.Element>(null)
  const [permissionStatus, setPermissionStatus] = useState<string>(
    RESULTS.GRANTED,
  )

  check(PERMISSION).then(result => {
    setPermissionStatus(result)
  })
  useEffect(() => {
    switch (permissionStatus) {
      case RESULTS.GRANTED:
        console.log('The permission is granted')
        setComponent(null)
        break
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        )
        break
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        )
        setComponent(
          <MissingPermissionsAlert
            onPress={() =>
              request(PERMISSION).then(reqResponse => {
                console.log('requestResponse', reqResponse)
                setPermissionStatus(reqResponse)
              })
            }
          />,
        )
        break      
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore')
        setComponent(
          <MissingPermissionsAlert
            onPress={() =>
              openSettings().catch(() => console.warn('cannot open settings'))
            }
          />,
        )
        break
    }
  }, [permissionStatus, appState])

  return component
}