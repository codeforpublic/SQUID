import React, { useState, useEffect } from 'react'
import { MockScreen } from '../MockScreen'
import { Avatar } from 'react-native-elements'
import { Camera, TakePictureResponse, RNCamera } from '../../components/Camera'
import { COLORS } from '../../styles'
import styled, { css } from '@emotion/native'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import { Title, Subtitle, Header } from '../../components/Base'
import { PrimaryButton } from '../../components/Button'
import { useNavigation } from 'react-navigation-hooks'
import { BackButton } from '../../components/BackButton'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import AsyncStorage from '@react-native-community/async-storage'
import RNFS from 'react-native-fs'
import { userPrivateData } from '../../state/userPrivateData'
import { useHUD } from '../../HudView'

const SelfieCaptureGuideline = () => {
  return (
    <GuidelineContainer>
      <FaceGuideline />
      {/* <CardGuideline /> */}
    </GuidelineContainer>
  )
}

const GuidelineContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const FaceGuideline = styled.View`
  width: 70%;
  border-color: ${COLORS.PRIMARY_LIGHT};
  border-width: 2px;
  border-radius: 500px;
  border-style: dashed;
  aspect-ratio: 1;
`

const MUTATE_USER = gql`
  mutation($image: String) {
    updateUser(data: { image: $image }) @client
  }
`

export const OnboardFace = () => {
  const [openCamera, setOpenCamera] = useState(false)
  const [uri, setURI] = useState<string | null>(null)
  const { showSpinner, hide } = useHUD()
  useEffect(() => {
    const faceURI = userPrivateData.getData('faceURI')
    if (faceURI) {
      RNFS.exists(faceURI).then(exists => {
        setURI(faceURI)
      })
    }
  }, [])
  const onCapture = async (camera: RNCamera) => {
    showSpinner()
    try {
      const data: TakePictureResponse = await camera.takePictureAsync()
      let dataPath = RNFS.DocumentDirectoryPath + `/face.jpg`
      const exists = await RNFS.exists(dataPath)
      console.log('exists', exists)

      if (exists) {
        // dataPath is not delete file immediately, so we need to change name anyway
        await RNFS.unlink(dataPath)
        dataPath = RNFS.DocumentDirectoryPath + `/face-${Date.now()}.jpg`
      }      
      
      await RNFS.moveFile(data.uri, dataPath)
      console.log('dataPath', data.uri, dataPath)
      if (Platform.OS === 'android') {
        setURI('file://' + dataPath)
      } else {
        setURI(dataPath)
      }
      setOpenCamera(false)
    } catch (err) {
      console.log(err)
      Alert.alert('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
    }
    hide()
  }
  const navigation = useNavigation()
  if (openCamera) {
    return (
      <Camera onCapture={onCapture} defaultType="front">
        <SelfieCaptureGuideline />
      </Camera>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.PRIMARY_DARK}
        barStyle="light-content"
      />
      <Header>
        <Title style={{ color: COLORS.WHITE }}>รูปถ่ายหน้าตรง</Title>
        <Subtitle>เห็นหน้าชัดเจน</Subtitle>
      </Header>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => setOpenCamera(true)}>
          <Avatar
            size={250}
            rounded
            source={uri ? { uri } : void 0}
            icon={uri ? void 0 : { name: 'camera', type: 'entypo' }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={'ถัดไป'}
          onPress={async () => {            
            await userPrivateData.setData('faceURI', uri)
            navigation.navigate('OnboardLocation')
          }}
          disabled={!uri}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.PRIMARY_DARK },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 12,
  },
})
