import React from 'react'
import { UpdateFaceCamera } from '../../components/UpdateFaceCamera'
import { useNavigation } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { COLORS } from '../../styles'

export const OnboardFaceCamera = () => {
  const navigation = useNavigation()
  const onCapture = uri => {
    if (navigation.state.params.setUri) {
      navigation.state.params.setUri(uri)
    }
    navigation.goBack()
  }
  return (
    <SafeAreaView style={styles.container}>
      <UpdateFaceCamera
        onClose={() => {
          navigation.goBack()
        }}
        onSelectImage={onCapture}
        onCapture={onCapture}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.PRIMARY_DARK },
})
