import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { QRResult } from '../../state/qr'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../styles'

const Label = ({ label, color, role }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <View style={{ marginTop: 6, backgroundColor: color, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' }}>        
        <Text style={{ color: color? 'white': 'black', fontFamily: FONT_FAMILY, fontSize: FONT_SIZES[500] }}>{role}</Text>
      </View>
      <View>
        <Text style={{ fontFamily: FONT_FAMILY, fontSize: FONT_SIZES[600], textDecorationLine: 'underline', textDecorationColor: color }}>{label}</Text>
      </View>
    </View>
  )
}

export const QRPopupContent = (props: any) => {
  const { appTitle, title } = props
  const qrResult: QRResult = props.qrResult
  const tag = qrResult.getTag()
  const age = qrResult.getAge()
  const createdData = qrResult.getCreatedDate()
  const body = `${createdData.fromNow()}`
  let bodyStyle = { }
  const time = Date.now() - createdData
 
  if (time > 3 * 60 * 1000) {
    bodyStyle = { color: COLORS.YELLOW }
  }
  if (time > 10 * 60 * 1000) {
    bodyStyle = { color: COLORS.RED }
  }

  return (
    <View style={[styles.popupContentContainer]}>
      <View
        style={[
          styles.popupHeaderContainer,
          { backgroundColor: qrResult.getStatusColor() },
        ]}
      >
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText} numberOfLines={1}>
            {appTitle || ''}
          </Text>
        </View>
        <View>
          <Text style={{
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZES[500],
            color: 'white',
            paddingRight: 16,
          }}>ลงทะเบียนมาแล้ว {age}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentTitleContainer}>
          <Text style={[styles.contentTitle, { color: qrResult.getStatusColor() }]}>{title || ''}</Text>
        </View>
        <View style={styles.contentTextContainer}>
          <Text style={styles.contentText}>อัพเดทล่าสุด </Text><Text style={[styles.contentText, bodyStyle]}>{body}</Text>
        </View>
        {tag?.title? <Label color={tag.tagRole?.color} label={tag.title} role={tag.tagRole?.title}/>: void 0}
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
    fontSize: FONT_SIZES[600],
    color: 'white',
    paddingLeft: 16,
  },
  headerTimeContainer: {
    marginHorizontal: 16,
  },
  headerTime: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    color: '#808080',
  },
  contentContainer: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  contentTitleContainer: {},
  contentTitle: {
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_BOLD,
    color: 'black',
  },
  contentTextContainer: {
    flexDirection: 'row'
  },
  contentText: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    color: '#808080',
  },
})
