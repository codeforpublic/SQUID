import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../styles'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  BarProgressQuarantine,
  ProgressLabel,
} from '../../components/BarProgressQuarantine'
import { PieChart } from 'react-native-chart-kit'
import {
  LocationField,
  LOCATION_TYPE,
  StoreLocationHistoryService,
} from '../../services/store-location-history.service'
import AsyncStorage from '@react-native-community/async-storage'
import I18n from '../../../i18n/i18n'

const barItems = [
  { label: I18n.t('home'), color: COLORS.WFH_HOME },
  { label: I18n.t('office'), color: COLORS.WFH_WORK },
  { label: I18n.t('other_places'), color: COLORS.WFH_OTHER },
  { label: I18n.t('gps_not_found'), color: COLORS.WFH_CLOSED_GPS },
  { label: I18n.t('data_not_found'), color: COLORS.WFH_NOT_TIME },
]
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
}

interface GraphData {
  name: string
  count: number
  color: string
}

interface Meaning {
  label: string
  color: string
  textColor?: string
}

const useMeanings = () => {
  const [meanings, setMeanings] = useState<Array<Meaning[]>>([])
  useEffect(() => {
    setMeanings([
      [
        { label: I18n.t('home'), color: COLORS.WFH_HOME },
        { label: I18n.t('office'), color: COLORS.WFH_WORK },
        { label: I18n.t('other_places'), color: COLORS.WFH_OTHER },
      ],
      [
        { label: I18n.t('gps_not_found'), color: COLORS.WFH_CLOSED_GPS },
        {
          label: I18n.t('data_not_found'),
          color: COLORS.WFH_NOT_TIME,
          textColor: COLORS.WFH_NOT_TIME_TEXT,
        },
      ],
    ])
  }, [setMeanings])
  return meanings
}

export const QuarantineOverview = () => {
  const [todayLabel, setTodayLabel] = useState<ProgressLabel[] | null>(null)
  const [three, setThree] = useState<GraphData[]>([])
  const [seven, setSeven] = useState<GraphData[]>([])
  const [fourTeen, setFourTeen] = useState<GraphData[]>([])
  const meanings = useMeanings()

  useEffect(() => {
    AsyncStorage.getItem(StoreLocationHistoryService.WFH_TODAY)
      .then((data) => {
        return data ? JSON.parse(data) : []
      })
      .then((response) => {
        const lists = new Array(24).fill(4.16)
        const keys = Object.keys(response)
        const dataToday: ProgressLabel[] = []
        const date = new Date()
        const currentHour = date.getHours()
        lists.forEach((_, i) => {
          const hour = i + 1
          const label = hour > 9 ? `${hour}` : `0${hour}`
          const findKey = keys.find((key) => key.includes(`${label}:00`))
          if (findKey) {
            const data = StoreLocationHistoryService.calculatePriority(
              response[findKey] as LocationField,
            )
            dataToday.push({ label, color: getColorData(data) })
          } else {
            dataToday.push({
              label,
              color:
                currentHour >= hour
                  ? COLORS.WFH_CLOSED_GPS
                  : COLORS.WFH_NOT_TIME,
            })
          }
        })
        setTodayLabel(dataToday)
      })
    StoreLocationHistoryService.calculatePreviousDataByCount(3)
      .then((data) => {
        return calculateData(data)
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setThree(getDataGraph(data))
        }
      })
    StoreLocationHistoryService.calculatePreviousDataByCount(7)
      .then((data) => {
        return calculateData(data)
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setSeven(getDataGraph(data))
        }
      })
    StoreLocationHistoryService.calculatePreviousDataByCount(14)
      .then((data) => {
        return calculateData(data)
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setFourTeen(getDataGraph(data))
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getColorData = (type: LOCATION_TYPE | null) => {
    switch (type) {
      case LOCATION_TYPE.HOME:
        return COLORS.WFH_HOME
      case LOCATION_TYPE.OFFICE:
        return COLORS.WFH_WORK
      case LOCATION_TYPE.OTHER:
        return COLORS.WFH_OTHER
      case LOCATION_TYPE.CLOSED_GPS:
        return COLORS.WFH_CLOSED_GPS
      default:
        return COLORS.WFH_NOT_TIME
    }
  }

  const calculateData = (data: LocationField): number[] | null => {
    const sum = data.H + data.W + data.O + data.G
    if (sum === 0) {
      return null
    }
    const empty = 100 - sum
    return [data.H, data.W, data.O, data.G, empty < 0 ? 0 : empty]
  }

  const getDataGraph = (data: number[]): GraphData[] => {
    return data.map((count, i) => {
      const item = barItems[i]
      return {
        name: item.label,
        count,
        color: item.color,
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.space}>
        <Text style={styles.textTitle}>{I18n.t('today_itinary')}</Text>
        {todayLabel && (
          <BarProgressQuarantine
            progressLabel={todayLabel}
            progresses={new Array(24).fill(4.16)}
            progressHeight={18}
            progressRadius={8}
            marginTop={30}
            showGrid={true}
            gridLabel={[
              I18n.t('midnight_to_six'),
              I18n.t('six_to_noon'),
              I18n.t('noon_to_eighteen'),
              I18n.t('eighteen_to_midnight'),
            ]}
          />
        )}
      </View>
      <View style={styles.line} />
      <View style={styles.space}>
        {three.length > 0 || seven.length > 0 || fourTeen.length > 0 ? (
          <Text style={styles.textTitle}>{I18n.t('history')}</Text>
        ) : (
          <Text style={styles.textNoData}>
            {I18n.t('no_information_found')}
          </Text>
        )}
        <View style={styles.pieChartList}>
          {three.length > 0 && (
            <View style={styles.pieChartStack}>
              <PieChart
                data={three}
                width={100}
                height={100}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="25"
                hasLegend={false}
                absolute
              />
              <Text>3 {I18n.t('quarantine_day')}</Text>
            </View>
          )}
          {seven.length > 0 && (
            <View style={styles.pieChartStack}>
              <PieChart
                data={seven}
                width={100}
                height={100}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="25"
                hasLegend={false}
                absolute
              />
              <Text>7 {I18n.t('quarantine_day')}</Text>
            </View>
          )}
          {fourTeen.length > 0 && (
            <View style={styles.pieChartStack}>
              <PieChart
                data={fourTeen}
                width={100}
                height={100}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="25"
                hasLegend={false}
                absolute
              />
              <Text>14 {I18n.t('quarantine_day')}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.space}>
        {meanings.map((items) => {
          return (
            <View style={styles.meanings}>
              {items.map((item, index) => {
                const textLabelStyle = StyleSheet.flatten([
                  {
                    color: item.textColor || item.color,
                    fontSize: FONT_SIZES[500],
                    fontWeight: '400',
                    fontFamily: FONT_FAMILY,
                  },
                ])
                const iconStyle = StyleSheet.flatten([
                  styles.iconMeaning,
                  { backgroundColor: item.color },
                ])
                return (
                  <>
                    {index > 0 && <View style={{ flex: 0.1 }} />}
                    <View style={styles.meaningList}>
                      <View style={iconStyle} />
                      <Text style={textLabelStyle}>{item.label}</Text>
                    </View>
                  </>
                )
              })}
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 15,
  },
  textTitle: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
    fontWeight: '500',
    color: '#000000',
    opacity: 0.7,
    textAlign: 'center',
    paddingBottom: 16,
  },
  textNoData: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
    opacity: 0.7,
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#C4C4C4',
  },
  space: {
    marginTop: 15,
    marginBottom: 15,
  },
  pieChartList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pieChartStack: {
    display: 'flex',
    alignItems: 'center',
  },
  meanings: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  meaningList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMeaning: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
})
