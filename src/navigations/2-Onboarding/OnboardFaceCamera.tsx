import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UpdateFaceCamera } from '../../components/UpdateFaceCamera'

export const OnboardFaceCamera = ({ route }) => {
  const navigation = useNavigation()
  const onCapture = (uri) => {
    if (route.params.setUri && uri) {
      route.params.setUri(uri)
      navigation.goBack()
    }
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <UpdateFaceCamera
          onClose={() => {
            navigation.goBack()
          }}
          onSelectImage={onCapture}
          onCapture={onCapture}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
})
