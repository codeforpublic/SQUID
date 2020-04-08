import { Dimensions, StyleSheet } from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'
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
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: isSmallDevice ? 24 : 36,
    alignSelf: 'center',
    color: COLORS.WHITE,
  },
  itemTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: isSmallDevice ? 18 : 20,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: isSmallDevice ? 16 : 18,
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
