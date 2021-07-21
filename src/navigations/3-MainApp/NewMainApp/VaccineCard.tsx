import moment from 'moment'
import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import I18n from '../../../../i18n/i18n'
import MainCard from '../../../components/MainCard'
import ReloadButton from '../../../components/ReloadButton'
import { useVaccine, Vaccination } from '../../../services/use-morprom'
import { FONT_BOLD, FONT_SIZES } from '../../../styles'

const VaccineCard: React.FC = () => {
  const navigation = useNavigation()
  const { vaccineList, getUpdateTime, reloadMorprom } = useVaccine()

  const ts = getUpdateTime && getUpdateTime()
  const updateTime = ts ? `${I18n.t('last_update')} ${ts.format(I18n.t('fully_date'))}` : ''

  return (
    <MainCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderView}>
          <Image source={require('../../../assets/morprom-icon.png')} width={20} height={20} />
          <Text style={styles.cardHeaderText}>{I18n.t('my_vaccinations_header')}</Text>
        </View>
      </View>
      {!vaccineList?.length ? (
        <>
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
              onPress={() => navigation.navigate('NewMainApp', { card: 1 })}
            >
              <Text style={styles.textScanButton}>{I18n.t('scan_qr_button')}</Text>
            </TouchableHighlight>
          </View>
        </>
      ) : (
        <>
          <View style={styles.textUpdateView}>
            <Text style={styles.textUpdate}>{updateTime}</Text>
            <ReloadButton onClick={reloadMorprom} />
          </View>
          <View style={styles.vaccineListContianer}>
            <VaccineList data={vaccineList} />
          </View>
        </>
      )}
    </MainCard>
  )
}

const VaccineList = ({ data }: { data: Vaccination[] }) => {
  const len = data.length
  const today = moment()

  return (
    <FlatList
      style={styles.listView}
      data={data}
      renderItem={({ item, index }) => {
        const itemListStyle = index === 0 ? styles.listItem : { ...styles.listItem, ...styles.listBorder }
        const vacNo = len - index
        const date = moment(item.immunizationDate).locale(I18n.locale || 'th')
        const days = today.diff(date, 'days')
        return (
          <View style={itemListStyle} key={'c' + index}>
            <View style={styles.vaccineImageView}>
              <Image
                source={require('../../../assets/vaccine-shot.png')}
                style={styles.vaccineImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.informationView}>
              <Text style={styles.vaccineNo}>{I18n.t('vaccine_number') + vacNo}</Text>
              <Text style={styles.vaccineInfo}>{item.vaccineRefName}</Text>
              <Text style={styles.vaccineInfo}>{date.format(I18n.t('date'))}</Text>
            </View>
            <View style={styles.dayView}>
              <View style={styles.dayTextContainer}>
                <Text style={styles.dayText}>{days}</Text>
                <Text style={styles.daySuffix}>{I18n.t('days')}</Text>
              </View>
            </View>
          </View>
        )
      }}
    />
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
  cardHeaderView: {
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    marginLeft: 20,
    color: 'white',
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
  textUpdate: {
    marginVertical: 10,
    marginRight: 10,
    color: '#222222',
  },
  listView: {
    flex: 1,
    width: '100%',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 20,
  },
  listBorder: {
    borderTopWidth: 1,
    borderTopColor: '#DBDBDB',
  },
  vaccineImageView: {
    width: 25,
  },
  informationView: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  dayView: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dayTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dayText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#1E4E87',
  },
  daySuffix: {
    fontSize: FONT_SIZES[500],
    color: '#1E4E87',
    marginBottom: 6,
  },
  vaccineListContianer: {
    width: '100%',
    flex: 1,
  },
  vaccineImage: {
    width: 20,
    height: 20,
  },
  vaccineNo: {
    fontSize: FONT_SIZES[500],
    fontWeight: 'bold',
    lineHeight: 30,
  },
  vaccineInfo: {
    fontSize: FONT_SIZES[400],
    color: '#808080',
    lineHeight: 25,
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
  textUpdateView: {
    flexDirection: 'row',
  },
})
export default VaccineCard
