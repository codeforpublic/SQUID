import { StackScreenProps } from '@react-navigation/stack'
import React, { useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { WebView } from 'react-native-webview'
import { COLORS } from '../styles'

const CloseButton = ({ onClose }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => {
      onClose()
    }}
  >
    <EvilIcons name='close' color='white' size={48} />
  </TouchableOpacity>
)

export const WebviewScreen = ({ route }: StackScreenProps<any, 'Webview'>) => {
  const webviewRef = useRef<WebView>()

  const { uri, onClose } = route.params as any

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.BLACK_1,
      }}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: COLORS.BLACK_1,
        }}
      >
        <View style={{ flex: 1 }} />
        <CloseButton onClose={onClose} />
      </View>
      <WebView
        source={{ uri }}
        ref={(ref) => {
          webviewRef.current = ref
          if (webviewRef.current) {
            // setTimeout(() => {
            //   webviewRef.current.injectJavaScript(
            //     `window.ReactNativeWebView.postMessage("complete")`,
            //   )
            // }, 2000)
          }
        }}
        style={{
          flex: 1,
        }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'complete') {
            onClose()
          }
          // console.log('event.nativeEvent.data', event.nativeEvent.data)
          // alert(event.nativeEvent.data)
        }}
      />
    </SafeAreaView>
  )
}
