import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { StoreLocationHistoryService } from '../../../services/store-location-history.service'
import { BarProgressQuarantine } from '../../../components/BarProgressQuarantine'
import {
  BASE_LINE,
  COLORS,
  FONT_BOLD,
  FONT_FAMILY,
  FONT_SIZES,
  GUTTER,
} from '../../../styles'
import I18n from '../../../../i18n/i18n'

export const QuarantineSummary: React.FC = () => {
  const [progresses, setProgresses] = useState<number[]>([])
  const navigation = useNavigation()

  const items = [
    { label: I18n.t('home'), color: COLORS.WFH_HOME },
    { label: I18n.t('office'), color: COLORS.WFH_WORK },
    { label: I18n.t('other_places'), color: COLORS.WFH_OTHER },
    { label: I18n.t('gps_not_found'), color: COLORS.WFH_CLOSED_GPS },
  ]

  const goToQuarantinePage = () => {
    navigation.navigate('SetLocationHome')
  }

  useEffect(() => {
    StoreLocationHistoryService.calculatePreviousDataByCount(14).then(
      (data) => {
        setProgresses([data.H, data.W, data.O, data.G])
      },
    )
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <TouchableOpacity
          style={styles.buttonNext}
          onPress={goToQuarantinePage}
        >
          <Text style={styles.title}>
            {I18n.t('quarantine_work_from_home')}
          </Text>
          <Image
            style={styles.titleIcon}
            source={require('../../../assets/icons/arrow_right_black.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.barBox}>
        <View style={styles.dayContainer}>
          <Text style={styles.barTitleDay}>14</Text>
          <Text style={styles.barTitleUnit}> {I18n.t('quarantine_day')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <BarProgressQuarantine
            progressLabel={items}
            progresses={progresses}
          />
          <View style={styles.labelBox}>
            {items.map((item, i) => {
              const textLabelStyle = StyleSheet.flatten([
                styles.textLabel,
                { color: item.color },
              ])
              const iconLabel = StyleSheet.flatten([
                styles.iconLabel,
                { backgroundColor: item.color },
              ])
              return (
                <>
                  {i > 0 && <View style={{ flex: 0.2 }} />}
                  <View style={styles.labelItem}>
                    <View style={iconLabel} />
                    <Text style={textLabelStyle}>{item.label}</Text>
                  </View>
                </>
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: GUTTER * 0.5,
  },
  titleBox: {},
  buttonNext: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleIcon: {
    fontFamily: FONT_FAMILY,
    width: FONT_SIZES[400],
    height: FONT_SIZES[400],
    resizeMode: 'contain',
    marginTop: 6,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[500],
    fontWeight: '500',
    marginBottom: FONT_SIZES[500] * 0.5,
  },
  barBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  barTitleBox: {
    flexBasis: '15%',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 23,
  },
  barTitleDay: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[700],
    letterSpacing: -FONT_SIZES[700] * 0.1,
    fontWeight: '500',
    textAlign: 'center',
  },
  barTitleUnit: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
    fontWeight: '500',
    opacity: 0.6,
  },
  barProgress: {
    display: 'flex',
    flexDirection: 'row',
    width: '85%',
    flexShrink: 0,
    flexGrow: 0,
    paddingTop: 5,
  },
  dayContainer: {
    paddingRight: BASE_LINE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBox: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    flexGrow: 0,
    flexWrap: 'wrap',
  },
  labelItem: {
    display: 'flex',
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2.5,
    marginRight: 3,
  },
  textLabel: {
    marginLeft: 3,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
  },
  iconLabel: {
    width: 6,
    height: 6,
    borderRadius: 7,
  },
})
