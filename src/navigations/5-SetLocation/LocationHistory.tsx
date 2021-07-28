import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native'
import WebView from 'react-native-webview'
import { FormHeader } from '../../components/Form/FormHeader'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { LONGDO_MAP_HTML } from './longdo-history-html'
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'
import { LocationMode } from './const'
import I18n from '../../../i18n/i18n'

export const LocationHistory = ({ navigation, route }) => {
  const scroll = useRef<any>(null)
  const webviewRef = useRef<WebView>()
  const [mode, setMode] = useState<LocationMode | null>(null)
  const [locations, setLocations] = useState<any[]>([])
  const [coordinate, setCoordinate] = useState<any>({})

  const onBack = useCallback(() => {
    navigation.pop()
  }, [navigation])

  const loadLocation = useCallback(() => {
    const mode = route.params.mode
    if (mode) {
      setMode(mode)
      AsyncStorage.getItem(mode).then((response) => {
        if (response) {
          const transformed = appendId(JSON.parse(response))
          setLocations(transformed)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.mode])

  useEffect(() => {
    if (webviewRef && webviewRef.current && Array.isArray(locations) && locations.length > 0) {
      setTimeout(() => {
        setCoordinate(locations[0])
      }, 1000)
    }
  }, [webviewRef, locations])

  useEffect(() => {
    loadLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { longitude, latitude, no } = coordinate
    const index = locations.findIndex((location) => location.no === no)
    const findIndex = locations.length - index
    if (index === 0) {
      setCurrentMaker(latitude, longitude)
    } else {
      setMaker(latitude, longitude, findIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinate])

  const setMaker = (lat: number, lon: number, index: number) => {
    if (!lat || !lon) {
      return
    }
    const js = `ThailandPlusMap.setMaker(${lat}, ${lon}, ${index});`
    // console.log(js)

    // setTimeout(() => {
    webviewRef.current?.injectJavaScript(js)
    // }, 1000)
  }

  const setCurrentMaker = (lat: number, lon: number) => {
    if (!lat || !lon) {
      return
    }
    const js = `ThailandPlusMap.setCurrentMaker(${lat}, ${lon});`
    // console.log(js)

    webviewRef.current?.injectJavaScript(js)
  }

  const changeCoordinate = (location: ListRenderItemInfo<any>) => () => {
    setCoordinate(location.item)
    scroll.current.scrollToIndex({
      animated: true,
      index: location.index,
      viewPosition: 0.5,
    })
  }

  const appendId = (locations: any) => {
    return locations.map((location: any) => {
      location.id = generateId(10)
      return location
    })
  }

  const generateId = (length: number) => {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  const getPinComponent = (selected: boolean): JSX.Element => {
    if (selected) {
      return <Image resizeMode='contain' style={{ height: 40 }} source={require('../../assets/icons/pin-blue.png')} />
    }
    return (
      <Image resizeMode='contain' style={{ height: 40 }} source={require('../../assets/icons/pin-blue-white.png')} />
    )
  }

  const getTimestampToDateFormat = (timestamp: number | string): string => {
    return moment(timestamp).format('DD/MM/YYYY')
  }

  const getTitleLocation = (index: number): JSX.Element => {
    if (index === 0) {
      return (
        <Text style={styles.textTitleLastPin}>
          {mode === 'OFFICE-LIST' ? I18n.t('lasted_office_location') : I18n.t('lasted_home_location')}
        </Text>
      )
    }
    return (
      <Text style={styles.textTitlePin}>
        {getTimestampToDateFormat(locations[index - 1].no)}
        {' - '}
        {getTimestampToDateFormat(locations[index].no)}
      </Text>
    )
  }

  const displayLatitudeLongitude = (locationItem: any) => {
    if (locationItem.latitude && locationItem.longitude) {
      return `${locationItem.latitude}, ${locationItem.longitude}`
    }
    return ''
  }

  return (
    <View
      style={[
        styles.flexContainer,
        {
          backgroundColor: COLORS.PRIMARY_DARK,
        },
      ]}
    >
      <SafeAreaView />
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.fillHeight} bounces={false}>
        <FormHeader
          onBack={onBack}
          white
          whiteLogo
          style={[styles.flexContainer, styles.paddingTop]}
          title={coordinate?.name || route.params.title || displayLatitudeLongitude(coordinate)}
        >
          <View style={styles.container} />
          <View style={styles.formContainer}>
            <WebView
              ref={(ref) => ((webviewRef as any).current = ref)}
              source={{ html: LONGDO_MAP_HTML }}
              style={styles.webviewContainer}
              geolocationEnabled={true}
            />
          </View>
        </FormHeader>
      </ScrollView>
      <View style={styles.menuBox}>
        <FlatList
          style={styles.menu}
          data={locations}
          ref={scroll}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
          snapToAlignment={'center'}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separatorBox}>
                <Image
                  resizeMode='contain'
                  style={styles.separator}
                  source={require('../../assets/icons/arrow_right_black.png')}
                />
              </View>
            )
          }}
          renderItem={(renderItem) => {
            const { item: location, index } = renderItem
            const no = locations.length - index
            const selected = location.id === coordinate.id
            return (
              <View>
                <TouchableOpacity onPress={changeCoordinate(renderItem)}>
                  <View
                    style={StyleSheet.flatten([
                      styles.locationBox,
                      selected
                        ? {
                            borderTopColor: COLORS.PRIMARY_DARK,
                          }
                        : {},
                    ])}
                  >
                    <View style={styles.pin}>
                      {getPinComponent(selected)}
                      {index === 0 ? (
                        <Image
                          resizeMode='contain'
                          style={styles.imageHome}
                          source={require('../../assets/icons/icon-home.png')}
                        />
                      ) : (
                        <Text style={styles.positionNo}>#{no}</Text>
                      )}
                    </View>
                    <View>
                      {getTitleLocation(index)}
                      <Text style={styles.textLocationName}>{location.name || displayLatitudeLongitude(location)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  paddingTop: {
    paddingTop: 10,
  },
  container: {
    paddingHorizontal: 24,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
  },
  webviewContainer: {
    flex: 1,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
  },
  iconCurrentLocation: { width: 30, height: 30 },
  fillHeight: {
    flexGrow: 1,
  },
  locationBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 4,
    borderTopColor: '#ffffff',
  },
  menuBox: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: '#FFFFFF',
    height: 60,
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'scroll',
    paddingLeft: 10,
  },
  pin: {
    width: 45,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  imageHome: {
    position: 'absolute',
    width: 20,
    height: 30,
    top: -3,
  },
  separatorBox: {
    paddingRight: 8,
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    transform: [{ rotate: '180deg' }],
    height: 15,
  },
  positionNo: {
    position: 'absolute',
    top: 0,
    color: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: 0.25,
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[500],
  },
  textTitleLastPin: {
    color: COLORS.PRIMARY_DARK,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
    fontWeight: '400',
  },
  textTitlePin: {
    color: '#303030',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
    fontWeight: '400',
    marginRight: 15,
  },
  textLocationName: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[500],
    fontWeight: '600',
    marginRight: 15,
  },
})
