import React, { useState, useEffect, useRef } from 'react'
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
  BackHandler,
} from 'react-native'
import { Title, Subtitle, Header, WhiteText } from '../../components/Base'
import { PrimaryButton } from '../../components/Button'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { BackButton } from '../../components/BackButton'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import AsyncStorage from '@react-native-community/async-storage'
import RNFS from 'react-native-fs'
import { userPrivateData } from '../../state/userPrivateData'
import { useHUD } from '../../HudView'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { SelfieCaptureGuideline } from '../../components/SelfieCaptureGuideline'
import { RELATIVE_FACE_PATH } from '../const'

const MUTATE_USER = gql`
  mutation($image: String) {
    updateUser(data: { image: $image }) @client
  }
`

export const OnboardFace = () => {
  const [uri, setUri] = useState(userPrivateData.getFace())
  useEffect(() => {
    if (uri) {
      RNFS.exists(uri).then(exists => {
        if (!exists) {
          setUri(null)
        }
      })
    }
  }, [])

  const navigation = useNavigation()

  const navigateToCamera = () => {
    navigation.navigate('OnboardFaceCamera', { setUri })
  }

  const onSubmit = async () => {
    await userPrivateData.setFace(uri, { isTempUri: true })
    navigation.navigate('OnboardLocation')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.WHITE}
        barStyle="dark-content"
      />
      <Header>
        <Title style={{ color: COLORS.BLACK_1 }}>รูปถ่ายหน้าตรง</Title>
        <Subtitle>เห็นหน้าชัดเจน</Subtitle>
      </Header>
      <View style={styles.content}>
        <TouchableOpacity onPress={navigateToCamera}>
          <Avatar
            size={250}
            rounded
            source={uri ? { uri } : void 0}
            icon={uri ? void 0 : { name: 'camera', type: 'entypo' }}
          />
        </TouchableOpacity>
        {uri && (
          <TouchableOpacity onPress={navigateToCamera}>
            <WhiteText style={{ marginTop: 12 }}>
              <FeatherIcon name="camera" color="white" size={20} /> ถ่ายใหม่
            </WhiteText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.footer}>
        <PrimaryButton title={'ถัดไป'} onPress={onSubmit} disabled={!uri} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
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
