import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import RNFS from 'react-native-fs'
import { SafeAreaView } from 'react-native-safe-area-context'
import FeatherIcon from 'react-native-vector-icons/Feather'
import I18n from '../../../i18n/i18n'
import { ColorText } from '../../components/Base'
import { PrimaryButton } from '../../components/Button'
import { FormHeader } from '../../components/Form/FormHeader'
import { userPrivateData } from '../../state/userPrivateData'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../styles'

export const OnboardFace = () => {
  const [uri, setUri] = useState(userPrivateData.getFace())

  useEffect(() => {
    if (uri) {
      RNFS.exists(uri).then((exists) => {
        if (!exists) {
          setUri('')
        }
      })
    }
  }, [uri])

  const navigation = useNavigation()

  const navigateToCamera = () => {
    navigation.navigate('OnboardFaceCamera', { setUri })
  }

  const onSubmit = async () => {
    if (uri) {
      await userPrivateData.setFace(uri, { isTempUri: true })
      // navigation.navigate('OnboardLocation')
      navigation.navigate('OnboardEnterQuestion')
    }
  }

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.WHITE} barStyle='dark-content' />
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
            <FeatherIcon name='camera' color={COLORS.BLUE} size={20} />
            <ColorText color={COLORS.BLUE} style={{ marginLeft: 12, fontSize: FONT_SIZES[700] }}>
              {uri ? I18n.t('retake_photo') : I18n.t('take_photo')}
            </ColorText>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            style={{ width: '100%' }}
            containerStyle={{ width: '100%' }}
            title={I18n.t('next')}
            onPress={onSubmit}
            disabled={!uri}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: COLORS.WHITE },
  container: { flex: 1, backgroundColor: COLORS.WHITE, marginHorizontal: 24 },
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
