import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, ImageURISource, StatusBar, StyleSheet, TouchableOpacity, View, Button } from 'react-native'
import { Avatar } from 'react-native-elements'
import RNFS from 'react-native-fs'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import I18n from '../../../i18n/i18n'
import { PrimaryButton } from '../../components/Button'
import Texts from '../../components/Texts'
import { userPrivateData } from '../../state/userPrivateData'
import { COLORS, FONT_SIZES } from '../../styles'
import { PageBackButton } from './components/PageBackButton'

const ListItem = ({ source, label, onPress }: { source: ImageURISource; label: string; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.wFull} onPress={onPress}>
      <View style={styles.listItem}>
        <Image style={styles.listImage} source={source} width={24} />
        <Texts.Normal style={styles.listLabel}>{label}</Texts.Normal>
      </View>
    </TouchableOpacity>
  )
}

export const OnboardFace = () => {
  const [uri, setUri] = React.useState<string>(userPrivateData.getFace())
  const [popupCamera, setPopupCamera] = React.useState(false)
  const area = useSafeAreaInsets()
  const navigation = useNavigation()

  React.useEffect(() => {
    if (uri) {
      RNFS.exists(uri).then((exists) => {
        // if (!exists) {
        //   setUri('')
        // }
      })
    }
  }, [uri])

  const navigateToCamera = () => {
    setPopupCamera(false)
    navigation.navigate('OnboardFaceCamera', { setUri })
  }

  const navigateToGallery = () => {
    setPopupCamera(false)
    navigation.navigate('OnboardFaceCamera', { setUri })
  }

  const setPopupCameraSelector = () => {
    setPopupCamera(!popupCamera)
  }

  const footerStyle = {
    paddingBottom: area.bottom,
    paddingLeft: area.left,
    paddingRight: area.right,
  }

  const footerButtonStyle = popupCamera
    ? {
        backgroundColor: COLORS.WHITE,
      }
    : {
        backgroundColor: COLORS.DARK_BLUE,
      }

  const footerTitleButtonStyle = popupCamera
    ? {
        color: COLORS.DARK_BLUE,
      }
    : {
        color: COLORS.WHITE,
      }

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.WHITE} barStyle='dark-content' />
        {/* <PageBackButton label={I18n.t('term_and_conditions')} /> */}
        <View style={styles.header}>
          <Texts.Bold style={styles.title}>{I18n.t('select_image_profile')}</Texts.Bold>
        </View>
        <TouchableOpacity style={styles.contentContainer} onPress={() => setPopupCamera(false)}>
          <View style={styles.content}>
            <View style={styles.profileImage}>
              <Avatar size={128} rounded source={uri ? { uri } : require('../../assets/profile_placeholder.png')} />
            </View>
            <Texts.Normal style={styles.photoDescription}>{I18n.t('photo_description')}</Texts.Normal>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={[styles.footer, footerStyle]}>
        {popupCamera ? (
          <View style={styles.footerPopup}>
            <ListItem source={require('../../assets/camera.png')} label={I18n.t('camera')} onPress={navigateToCamera} />
            <ListItem
              source={require('../../assets/gallery.png')}
              label={I18n.t('gallery')}
              onPress={navigateToGallery}
            />
            <View style={styles.footerButtonContainer}>
              <PrimaryButton
                style={{ ...styles.primaryButton, ...footerButtonStyle }}
                containerStyle={styles.primaryButtonContainer}
                titleStyle={footerTitleButtonStyle}
                title={I18n.t('cancel')}
                onPress={setPopupCameraSelector}
              />
            </View>
          </View>
        ) : (
          <React.Fragment>
            <View style={styles.footerButtonContainer}>
              <PrimaryButton
                style={uri ? styles.primaryButtonChangProfile : { ...styles.primaryButton, ...footerButtonStyle }}
                containerStyle={styles.primaryButtonContainer}
                titleStyle={uri ? { color: COLORS.DARK_BLUE } : footerTitleButtonStyle}
                title={uri ? I18n.t('change_profile_image') : I18n.t('add_image')}
                onPress={setPopupCameraSelector}
              />
              {uri ? (
                <PrimaryButton
                  style={styles.nextButton}
                  containerStyle={styles.primaryButtonContainer}
                  titleStyle={footerTitleButtonStyle}
                  title={I18n.t('next')}
                  onPress={async () => {
                    if (uri) {
                      await userPrivateData.setFace(uri, { isTempUri: true })
                      // navigation.navigate('OnboardLocation')
                      navigation.navigate('OnboardEnterQuestion')
                    }
                  }}
                />
              ) : null}
            </View>
          </React.Fragment>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: COLORS.WHITE },
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  button: {
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderColor: COLORS.BLUE,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    marginBottom: 25,
  },
  footer: {
    marginBottom: 12,
  },
  header: {
    textAlign: 'left',
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  title: {
    fontSize: FONT_SIZES[500],
    color: COLORS.DARK_BLUE,
  },
  photoDescription: {
    color: COLORS.DARK_BLUE,
    width: '80%',
    textAlign: 'center',
    lineHeight: 23,
  },
  wFull: {
    width: '100%',
  },
  primaryButtonContainer: {
    width: '100%',
  },
  footerButtonContainer: {
    marginTop: 24,
    paddingLeft: 20,
    paddingRight: 20,
  },
  primaryButton: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.DARK_BLUE,
  },
  primaryButtonChangProfile: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.DARK_BLUE,
    backgroundColor: COLORS.WHITE,
  },
  nextButton: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.DARK_BLUE,
    backgroundColor: COLORS.DARK_BLUE,
    marginTop: 8,
  },
  footerPopup: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    paddingTop: 24,
  },
  listItem: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    marginLeft: 40,
    marginBottom: 8,
  },
  listImage: {
    marginRight: 10,
  },
  listLabel: {
    color: COLORS.DARK_BLUE,
  },
})
