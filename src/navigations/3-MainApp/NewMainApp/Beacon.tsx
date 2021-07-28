import React from 'react'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { View, Text, Image, StyleSheet } from 'react-native'
import I18n from '../../../../i18n/i18n'

export const Beacon = ({ location }: { location: string }) => {
  if (location) {
    return (
      <View style={styles.container}>
        <Image source={require('../morchana.png')} style={styles.beaconImg} resizeMode='contain' />
        <View style={styles.beaconInfo}>
          <Text style={styles.title}>{I18n.t('beacon_header')}</Text>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>
            {location}
          </Text>
        </View>
      </View>
    )
  } else {
    return <View style={{ marginTop: 12 }} />
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7745FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 15,
    paddingBottom: 30,
    marginBottom: -25,
  },
  beaconImg: {
    marginRight: 10,
  },
  beaconInfo: {
    maxWidth: 300,
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
  },
  text: {
    color: '#fff',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
  },
})
