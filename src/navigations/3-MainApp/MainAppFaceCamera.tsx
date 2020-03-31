import React from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { UpdateFaceCamera } from '../../components/UpdateFaceCamera'
import { userPrivateData } from '../../state/userPrivateData'
import RNFS from 'react-native-fs'
import { RELATIVE_FACE_PATH } from '../const'
import { Platform, StyleSheet } from 'react-native'
import { COLORS } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'

export const MainAppFaceCamera = () => {
  const navigation = useNavigation()
  const onCapture = async uri => {
    await userPrivateData.setFace(uri, { isTempUri: true })
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
        onCapture={onCapture}
        onSelectImage={onCapture}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
})
