import React, { useState, useEffect, useRef } from 'react'
import { MockScreen } from '../MockScreen'
import { Avatar } from 'react-native-elements'
import { Camera, TakePictureResponse, RNCamera } from '../../components/Camera'
import { COLORS, FONT_FAMILY } from '../../styles'
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
  Text,
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
import { FormHeader } from '../../components/Form/FormHeader'

const MUTATE_USER = gql`
  mutation($image: String) {
    updateUser(data: { image: $image }) @client
  }
`

export const OnboardFace = () => {
  // const [uri, setUri] = useState(userPrivateData.getFace())
  const [uri, setUri] = useState()
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
      <View style={styles.header}>
        <Text style={styles.title}>ภาพโปรไฟล์</Text>
        <Text style={styles.subtitle}>ถ่ายรูปหน้าตรง เห็นหน้าชัดเจน</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity onPress={navigateToCamera}>
          <Avatar
            size={250}
            rounded
            overlayContainerStyle={{backgroundColor:'#E6F2FA' }}          
            source={uri ? { uri } : require('./camera-mask.png')}
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
  header: {
    marginTop: 30,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
})
