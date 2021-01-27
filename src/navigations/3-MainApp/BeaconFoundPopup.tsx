import React, { Component } from 'react'
import I18n from '../../../i18n/i18n';
import { Text, View, StyleSheet, Image, StatusBar, Platform, Dimensions } from 'react-native'
import { FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../styles'

export const BeaconFoundPopupContent = (props: any) => {
  const result: any = props.result
  return (
    <View style={styles.popupContentContainer}>
      <View style={styles.contentContainer}>
        <Image style={styles.beaconImg} source={require('./beacon_icon.png')} resizeMode="contain" />
        <View>
          <View style={styles.contentTitleContainer}>
            <Text style={styles.contentTitle}>{I18n.t('beacon_header')}</Text>
          </View>
          <View style={styles.contentTextContainer}>
            <Text style={styles.contentText} numberOfLines={1} ellipsizeMode='tail'>{result}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  popupContentContainer: {
    zIndex: 1000,
    backgroundColor: '#1E5BB8',
    marginLeft: -8,
    marginRight: -8,
    marginTop: (Platform.OS === 'ios' ? isIphoneX() ? 44 : 20 : (StatusBar.currentHeigh || 50) + 10) * -1,
    minHeight: 86,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  beaconImg: {
    justifyContent: 'flex-start',
    marginRight: 10,
    width: 45,
    height: 45,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  contentTitleContainer: {},
  contentTitle: {
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_BOLD,
    color: 'white',
  },
  contentTextContainer: {
    flexDirection: 'row',
    color: 'white'
  },
  contentText: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    color: 'white',
  },
});

function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}
