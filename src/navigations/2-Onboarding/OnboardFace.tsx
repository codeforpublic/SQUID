import React, { useState, useEffect } from 'react'
import { Avatar, normalize } from 'react-native-elements'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import {
  ColorText,
} from '../../components/Base'
import { PrimaryButton } from '../../components/Button'
import { useNavigation } from 'react-navigation-hooks'
import { gql } from 'apollo-boost'
import RNFS from 'react-native-fs'
import { userPrivateData } from '../../state/userPrivateData'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { FormHeader } from '../../components/Form/FormHeader'

import I18n from '../../../i18n/i18n';

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
    if (uri) {
      await userPrivateData.setFace(uri, { isTempUri: true })
      navigation.navigate('OnboardLocation')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
      <FormHeader>
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t('profile_picture')}</Text>
          <Text style={styles.subtitle}>{I18n.t('straight_and_clear_face_portrait')}</Text>
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
          <ColorText color={COLORS.BLUE} style={{ marginLeft: 12, fontSize: FONT_SIZES[700] }}>
            {uri ? I18n.t('retake_photo') : I18n.t('take_photo')}
          </ColorText>
        </TouchableOpacity>
      </View>
      <View style={styles.secondContent}>
        <View style= {{position: 'relative', height: '20%'}}>
          <View style={{ paddingLeft: 30, paddingRight: 16, position: 'absolute' }}>
            <Image source={require('../../assets/bx_bxs-face.png')}
              resizeMode="contain" 
              style={{width: normalize(40)}}
              />
          </View>
          <View style={{position: 'absolute'}}>
            <Text style={[styles.subtitle2, {paddingLeft: '28%'}]}>{I18n.t('straight_and_clear_face_portrait')}</Text>
            <Text style={styles.subtitle2}></Text>
          </View>

        </View>
        <View style= {{position: 'relative' , height: '20%'}}>
          <View style={{ paddingLeft: 30, paddingRight: 16, position: 'absolute' }}>
            <Image source={require('../../assets/refresh.png')}
              resizeMode="contain" 
              style={{width: normalize(40)}}
              />
          </View>
          <View style={{position: 'absolute'}}>
            <Text style={styles.subtitle2}>{I18n.t('change_picture_condition_1')}</Text>
            <Text style={styles.subtitle2}>{I18n.t('change_picture_condition_2')}</Text>
          </View>

        </View>
        {/* <View style={styles.viewLayer}>
          <Image source={require('../../assets/refresh.png')}
            style={styles.faceIcon}
            resizeMode="contain" />
          <Text style={styles.subtitle2}>คุณสามารถเปลี่ยนรูปภาพได้ 3 ครั้งภายใน 24 ชม. หลังติดตั้งโปรแกรม</Text>
        </View> */}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={{ width: '100%' }}
          containerStyle={{ width: '100%'}}
          title={I18n.t('next')}
          onPress={onSubmit}
          disabled={!uri}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE, marginHorizontal: 24 },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  secondContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '40%'
  },
  footer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 16,
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
  faceIcon: {
    height: '100%',
    width: '100%',
    paddingRight: 70,
    position: 'absolute',
    left: 2,
  },
  subtitle2: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    color: COLORS.SECONDARY_DIM,
    lineHeight: 40,
    textAlign: 'center',
    justifyContent: 'center',
    height: '50%',
    width: '100%',
    position: 'relative',
    paddingLeft: '25%'
  },
  subtitle3: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    color: COLORS.SECONDARY_DIM,
    lineHeight: 40,
    textAlign: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'relative',
    paddingLeft: '25%'
  },
  viewLayer: {
    flex: 1
  }
})
