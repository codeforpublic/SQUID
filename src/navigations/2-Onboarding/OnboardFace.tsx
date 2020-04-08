import React, { useState, useEffect, useRef } from 'react'
import { MockScreen } from '../MockScreen'
import { Avatar } from 'react-native-elements'
import { Camera, TakePictureResponse, RNCamera } from '../../components/Camera'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../styles'
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
import {
  Title,
  Subtitle,
  Header,
  WhiteText,
  ColorText,
} from '../../components/Base'
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
      <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
      <FormHeader >
        <View style={styles.header}>
          <Text style={styles.title}>ภาพโปรไฟล์</Text>
          <Text style={styles.subtitle}>ถ่ายรูปหน้าตรง เห็นหน้าชัดเจน</Text>
        </View>
      </FormHeader>
      <View style={styles.content}>
        <TouchableOpacity onPress={navigateToCamera}>
          <Avatar
            size={250}
            rounded
            overlayContainerStyle={{ backgroundColor: '#E6F2FA' }}
            source={uri ? { uri } : require('./camera-mask.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderStyle: 'dashed',
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            borderColor: COLORS.BLUE,
            paddingHorizontal: 16,
            marginTop: 12,
            borderRadius: 8,
          }}
          onPress={navigateToCamera}
        >
          <FeatherIcon name="camera" color={COLORS.BLUE} size={20} />
          <ColorText color={COLORS.BLUE} style={{ marginLeft: 12 }}>
            {uri ? 'ถ่ายใหม่' : 'ถ่ายรูป'}
          </ColorText>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    textAlign: 'left',
    marginBottom: 16,
    marginHorizontal: 24,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[700],
    color: COLORS.BLACK_1,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    lineHeight: 24,
    color: COLORS.SECONDARY_DIM,
  },
})
