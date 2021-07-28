import { useNavigation, RouteProp } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UpdateFaceCamera } from '../../components/UpdateFaceCamera'
import { userPrivateData } from '../../state/userPrivateData'

type Props = { route: RouteProp<{ setUri: (url: string) => void }, 'MainAppFaceCamera'> }

export const MainAppFaceCamera: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation()
  const onCapture = async (uri) => {
    if (uri) {
      await userPrivateData.setFace(uri, { isTempUri: true })
      if (route.params?.setUri) {
        route.params?.setUri(uri)
      }
      navigation.goBack()
    }
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
