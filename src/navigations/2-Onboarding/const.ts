import { Dimensions, StyleSheet } from 'react-native'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../../styles'
import { isSmallDevice } from '../../utils/responsive'

export const doctorSize = Dimensions.get('window').height >= 800 ? 218 : 120

export const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BLUE,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 30,
    height: 300,
  },
  title: {
    marginTop: 10,
    fontFamily: FONT_BOLD,
    fontSize: isSmallDevice ? FONT_SIZES[800] : FONT_SIZES[900],
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  itemTitle: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
    color: COLORS.SECONDARY_DARK,
  },
  subtitle: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
    textAlign: 'left',
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  description: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    lineHeight: 26,
    textAlign: 'left',
    color: COLORS.SECONDARY_DIM,
  },
})
