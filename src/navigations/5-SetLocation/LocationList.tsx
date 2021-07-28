import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, Image } from 'react-native'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../styles'
import AsyncStorage from '@react-native-community/async-storage'
import { LocationMode, LocationType } from './const'
import moment from 'moment'
import I18n from '../../../i18n/i18n'

interface LocationItem {
  label: string
  mode: LocationMode
}

export const LocationList = ({ navigation }) => {
  const [home, setHome] = useState<LocationType>(null)
  const [office, setOffice] = useState<LocationType>(null)

  const locations: LocationItem[] = [
    { label: I18n.t('home_location'), mode: 'HOME-LIST' },
    { label: I18n.t('office_location'), mode: 'OFFICE-LIST' },
  ]

  const loadLocation = useCallback(() => {
    Promise.all([AsyncStorage.getItem('HOME-LIST'), AsyncStorage.getItem('OFFICE-LIST')]).then(
      ([homeLocation, officeLocation]) => {
        if (homeLocation) {
          setHome(JSON.parse(homeLocation))
        }
        if (officeLocation) {
          setOffice(JSON.parse(officeLocation))
        }
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home, office])

  useEffect(() => {
    const unsubscribe = navigation.addListener('didFocus', () => {
      moment.locale(I18n.locale)
      loadLocation()
    })
    return () => {
      unsubscribe.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const getLocation = (mode: LocationMode) => {
    switch (mode) {
      case 'HOME-LIST':
        return home
      case 'OFFICE-LIST':
        return office
      default:
        return null
    }
  }

  const hasLocation = (items: LocationType): boolean => {
    return Array.isArray(items) && items.length > 0
  }

  const addLocationText = (items: LocationType): React.ReactNode => {
    if (hasLocation(items)) {
      return <Text style={styles.textEdit}>{I18n.t('edit')}</Text>
    } else {
      return <Text style={styles.textAddLocation}>{I18n.t('please_add_location')}</Text>
    }
  }

  const goToLocationHistory = (location: LocationItem) => () => {
    navigation.navigate('LocationHistory', {
      mode: location.mode,
      backIcon: 'close',
    })
  }

  const locationComp = (index: number, location: LocationItem): React.ReactNode => {
    const locationItems = getLocation(location.mode) || []
    const mode = location.mode
    const title = mode === 'HOME-LIST' ? I18n.t('set_your_home_location') : I18n.t('set_your_office_location')
    const locationStyled = StyleSheet.flatten([
      styles.locations,
      {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
    ])
    const displayLatitudeLongitude = (locationItem: any) => {
      return `${locationItem.latitude}, ${locationItem.longitude}`
    }

    const displayEditTimes = (editedLocations: LocationType[]) => {
      const editCount = editedLocations?.length - 1
      return `${editCount} ${I18n.t('time')}${I18n.currentLocale() === 'en' && editCount > 1 ? 's' : ''}`
    }

    return (
      <View style={locationStyled} key={index}>
        <View style={styles.locationType}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={styles.locationTextLabel}>{location.label}</Text>
            {!hasLocation(locationItems) && <Text style={styles.asterisk}>*</Text>}
          </View>
          {(!hasLocation(locationItems) || (hasLocation(locationItems) && locationItems.length < 10)) && (
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'rgba(0,0,0,0.1)'}
              onPress={() =>
                navigation.navigate('SetLocationMapWebView', {
                  title,
                  label: location.label,
                  mode: location.mode,
                  coordinate: hasLocation(locationItems) ? locationItems[0] : null,
                  onBack: () => {
                    navigation.pop()
                  },
                  backIcon: 'close',
                })
              }
            >
              <View style={styles.addLocation}>
                {addLocationText(locationItems)}
                <Image style={styles.iconAddLocation} source={require('../../assets/icons/arrow_right_black.png')} />
              </View>
            </TouchableHighlight>
          )}
        </View>

        {hasLocation(locationItems) && (
          <>
            <Text numberOfLines={1} style={styles.textLocationName}>
              {locationItems[0]?.name || displayLatitudeLongitude(locationItems[0])}
            </Text>
            {locationItems.length > 1 && (
              <View style={styles.locationHistoryDate}>
                <Text style={styles.textLocationCountLabel}>{I18n.t('edited')}</Text>
                <View style={{ flex: 0.05 }} />
                <TouchableOpacity onPress={goToLocationHistory(location)}>
                  <Text style={styles.textLocationCount}>{displayEditTimes(locationItems)}</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.05 }} />
                <Text style={styles.textLocationDateLabel}>{I18n.t('edit_lasted')} </Text>
                <Text style={styles.textLocationDate}>
                  {moment(locationItems[0].no).locale(I18n.currentLocale()).format('D MMM')}{' '}
                  {(moment(locationItems[0].no).year() + (I18n.currentLocale() === 'th' ? 543 : 0)).toString()}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    )
  }

  return (
    <View>
      {locations.map((location, index) => {
        return locationComp(index, location)
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  locations: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 80,
    marginLeft: 24,
    marginRight: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },
  locationType: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTextLabel: {
    fontFamily: FONT_BOLD,
    fontWeight: '500',
    fontSize: FONT_SIZES[500],
  },
  asterisk: {
    fontFamily: FONT_FAMILY,
    fontWeight: '400',
    fontSize: FONT_SIZES['500'],
    color: '#D73B82',
    marginLeft: 5,
  },
  addLocation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textAddLocation: {
    fontFamily: FONT_FAMILY,
    fontWeight: '500',
    fontSize: FONT_SIZES[500],
    color: COLORS.PRIMARY_DARK,
  },
  iconAddLocation: {
    width: 8,
    height: 18,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  textEdit: {
    fontFamily: FONT_FAMILY,
    fontWeight: '500',
    fontSize: FONT_SIZES[500],
    opacity: 0.6,
    color: 'black',
  },
  textLocationName: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    fontWeight: '400',
    opacity: 0.8,
    marginTop: 7,
    marginBottom: 7,
  },
  textLocationDateLabel: {
    opacity: 0.4,
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
    fontWeight: '400',
  },
  textLocationDate: {
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
    fontWeight: '400',
  },
  textLocationCountLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    fontWeight: '600',
  },
  textLocationCount: {
    fontWeight: '600',
    fontSize: FONT_SIZES[500],
    color: COLORS.PRIMARY_DARK,
    fontFamily: FONT_FAMILY,
    textDecorationLine: 'underline',
  },
  locationHistoryDate: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
