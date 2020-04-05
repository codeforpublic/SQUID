import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { QRResult } from '../../state/qr'
import { COLORS, FONT_FAMILY } from '../../styles'

const Label = ({ label }) => {
  return (
    <View style={{ marginTop: 6, backgroundColor: '#0C2641', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' }}>
      <Text style={{ color: 'white', fontFamily: FONT_FAMILY }}>{label}</Text>
    </View>
  )
}

export const QRPopupContent = (props: any) => {
  const { appIconSource, appTitle, timeText: proficientLabel, title, body } = props
  const qrResult: QRResult = props.qrResult
  return (
    <View style={[styles.popupContentContainer]}>
      <View
        style={[
          styles.popupHeaderContainer,
          { backgroundColor: qrResult.getStatusColor() },
        ]}
      >
        <View style={styles.headerIconContainer}>
          <Image style={styles.headerIcon} source={appIconSource || null} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText} numberOfLines={1}>
            {appTitle || ''}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentTitleContainer}>
          <Text style={[styles.contentTitle, { color: qrResult.getStatusColor() }]}>{title || ''}</Text>
        </View>
        <View style={styles.contentTextContainer}>
          <Text style={styles.contentText}>{body || ''}</Text>
        </View>
        {proficientLabel? <Label label={proficientLabel}/>: void 0}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  popupContentContainer: {
    backgroundColor: 'white', // TEMP
    borderRadius: 12,
    minHeight: 86,
    // === Shadows ===
    // Android
    elevation: 2,
    // iOS
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },

  popupHeaderContainer: {
    height: 32,
    backgroundColor: '#F1F1F1', // TEMP
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconContainer: {
    height: 20,
    width: 20,
    marginLeft: 12,
    marginRight: 8,
    borderRadius: 4,
  },
  headerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
  },
  headerTimeContainer: {
    marginHorizontal: 16,
  },
  headerTime: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: '#808080',
    lineHeight: 14,
  },
  contentContainer: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  contentTitleContainer: {},
  contentTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 25,
    fontFamily: FONT_FAMILY,
    color: 'black',
  },
  contentTextContainer: {},
  contentText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    lineHeight: 18,
    color: '#808080',
    marginTop: 5,
  },
})
