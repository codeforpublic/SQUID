import { Dimensions, StyleSheet } from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'


export const doctorSize = Dimensions.get('window').height >= 800 ? 250 : 150

export const styles = StyleSheet.create({
  title: {
    marginTop:10,
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: 36,
    textAlign: 'left',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  itemTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  description: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 26,
    textAlign: 'left',
    color: COLORS.SECONDARY_DIM,
  },
})
