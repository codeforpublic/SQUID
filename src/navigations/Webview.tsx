import React, { useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'
import { useNavigationParam } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-native-safe-area-context'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { COLORS } from '../styles'
import { View, TouchableOpacity } from 'react-native'

const CloseButton = ({ onClose }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => {
      onClose()
    }}
  >
    <EvilIcons name="close" color="white" size={48} />
  </TouchableOpacity>
)

export const WebviewScreen = () => {
  const webviewRef = useRef<WebView>()
  const uri = useNavigationParam('uri')
  const onClose = useNavigationParam('onClose')

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
        ref={ref => {
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
        onMessage={event => {
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
