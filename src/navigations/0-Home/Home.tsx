import React from 'react'
import { Alert, Image, StatusBar, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import CodePush from 'react-native-code-push'
import { PrimaryButton } from '../../components/Button'
import { DebugTouchable } from '../../components/DebugTouchable'
import { API_URL } from '../../config'
import { COLORS, FONT_FAMILY, FONT_SIZES, FONT_BOLD } from '../../styles'

import I18n from '../../../i18n/i18n'
import { useSafeArea } from 'react-native-safe-area-view'
import { changeLangTo } from '../../utils/change-lang'
// import { getLanguages } from 'react-native-i18n';

// I18n.fallbacks = true;
// I18n.defaultLocale = "th";
// getLanguages().then(languages => {
//   console.log(languages); // ['en-US', 'en']
//   I18n.locale = languages(0);
// });

export const Home = ({ navigation }) => {
  const inset = useSafeArea()
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.PRIMARY_DARK,
      }}
    >
      <StatusBar backgroundColor={COLORS.PRIMARY_DARK} barStyle='light-content' />
      <View style={styles.content}>
        <DebugTouchable
          onDebug={() => {
            CodePush.getUpdateMetadata().then((result) => {
              Alert.alert(API_URL)
            })
          }}
        >
          <Image source={require('../../assets/Logo.png')} resizeMode='contain' style={{ width: 300 }} />
        </DebugTouchable>
        <Text style={styles.description}>
          {I18n.t('load_use_fight')}
          {'\n'}
          {I18n.t('covid19_together')}
        </Text>
        <PrimaryButton
          title={I18n.t('register')}
          titleStyle={{
            color: '#00A0D7',
            width: 240,
          }}
          buttonStyle={{
            backgroundColor: 'white',
          }}
          onPress={async () => {
            navigation.navigate('SelectLanguageScreen')
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: 20,
    width: 262,
    marginBottom: 82,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[700],
    textAlign: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  changeLangSeparator: {
    color: 'white',
    fontSize: FONT_SIZES[700],
    marginHorizontal: 8,
  },
  changeLang: {
    color: 'white',
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[700],
  },
  button: {},
})
