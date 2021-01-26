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
  Dimensions,
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
  var {width} = Dimensions.get('window');

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
        <View style= {{position: 'relative', height: '30%'}}>
          <View style={{ paddingRight: 10, position: 'absolute' }}>
            <Image source={require('../../assets/bx_bxs-face.png')}
              resizeMode="cover" 
              style={{width: width * 0.01, overflow: 'visible'}}
              />
          </View>
          <View style={{position: 'absolute'}}>
            <Text style={[styles.subtitle2, {paddingLeft: '13%'}]}>{I18n.t('straight_and_clear_face_portrait')}</Text>
            <Text style={styles.subtitle2}></Text>
          </View>

        </View>
        <View style= {{position: 'relative' , height: '20%'}}>
          <View style={{ paddingRight: 16, position: 'absolute' }}>
            <Image source={require('../../assets/refresh.png')}
              resizeMode="cover" 
              style={{width: width * 0.01, overflow: 'visible'}}
              />
          </View>
          <View style={{position: 'absolute'}}>
            <Text style={[styles.subtitle2, {paddingLeft: '12%'}]}>{I18n.t('change_picture_condition_1')}</Text>
            <Text style={[styles.subtitle2, { paddingLeft: '8%', marginTop: '-3%'}]}>{I18n.t('change_picture_condition_2')}</Text>
          </View>

        </View>
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
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '60%',
    height: '50%',
    paddingLeft: '15%'
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
  subtitle2: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    color: COLORS.SECONDARY_DIM,
    lineHeight: 40,
    textAlign: 'center',
    justifyContent: 'center',
    height: '55%',
    width: '100%',
    position: 'relative',
  },
})
