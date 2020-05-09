import React, { useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'
import { useNavigationParam } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../styles'

export const WebviewScreen = () => {
  const webviewRef = useRef<WebView>()
  const uri = useNavigationParam('uri')
  const onClose = useNavigationParam('onClose')

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.GRAY_1,
      }}
    >
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
