import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import I18n from '../../../../i18n/i18n'
import MainCard from '../../../components/MainCard'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../../styles'

const VaccineCard: React.FC = () => {
  const navigation = useNavigation()

  // const smallDevice = Dimensions.get('window').height < 600
  // const logoStyle = {
  //   height: smallDevice ? 20 : 30,
  //   width: (smallDevice ? 20 : 30) * (260 / 140),
  // }

  return (
    <MainCard>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>My Vaccinations</Text>
      </View>
      <View style={styles.cardTextView}>
        <Text style={styles.textNoVaccine}>{I18n.t('no_vac_text_1')}</Text>
        <Text style={styles.textNoVaccine}>{I18n.t('no_vac_text_2')}</Text>
        <Text style={styles.textNoVaccine}>{I18n.t('no_vac_text_3')}</Text>
      </View>

      <View style={styles.cardButtonView}>
        <TouchableHighlight
          style={styles.ButtonScan}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => navigation.navigate('QRCodeScan')}
        >
          <Text style={styles.textScanButton}>{I18n.t('scan_qr_button')}</Text>
        </TouchableHighlight>
      </View>
    </MainCard>
  )
}

const styles = StyleSheet.create({
  cardHeader: {
    borderTopEndRadius: 14,
    borderTopStartRadius: 14,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E4E87',
  },
  cardHeaderText: {
    width: '100%',
    color: 'white',
    textAlign: 'center',
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_BOLD,
  },
  cardTextView: {
    marginTop: 48,
    marginBottom: 5,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  cardButtonView: {
    height: 80,
  },
  textVersion: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600] * 0.85,
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
  textVersionNumber: {
    color: '#222222',
    fontSize: FONT_SIZES[600] * 0.85,
    fontFamily: FONT_FAMILY,
  },
  sizer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GRAY_1,
    borderStyle: 'solid',
    maxHeight: 350,
  },
  flex1: {
    flex: 1,
  },
  textUpdate: {
    marginTop: 10,
    color: '#222222',
  },
  textNoVaccine: {
    marginTop: 10,
    color: '#808080',
    fontSize: FONT_SIZES[500] * 0.7,
  },
  textScanButton: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES[400] * 0.83,
  },
  ButtonScan: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 35,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E4E87',
  },
})
export default VaccineCard
