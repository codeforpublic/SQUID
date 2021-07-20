/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native'
import { COLORS, FONT_BOLD, FONT_MED, FONT_SIZES } from '../../styles'
import { FormHeader } from '../../components/Form/FormHeader'
import WebView from 'react-native-webview'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { LONGDO_MAP_HTML } from './longdo-html'
import { LocationMode } from './const'
import _ from 'lodash'
import GetLocation from 'react-native-get-location'
import I18n from '../../../i18n/i18n'
import { PrimaryButton } from '../../components/Button'

interface Coordinate {
  name?: string
  latitude: number
  longitude: number
}
export interface ListCoordinate {
  no: number
  name?: string
  latitude: number
  longitude: number
}
export const SetLocationMapWebView = ({ navigation }: any) => {
  const webviewRef = useRef<WebView>()
  const [coordinate, setCoordinate] = useState<Coordinate>({
    latitude: 13.852423,
    longitude: 100.5803335,
  })
  const [homeList, setHomeList] = useState<ListCoordinate[]>([])
  const [officeList, setOfficeList] = useState<ListCoordinate[]>([])
  const [mode, setMode] = useState<LocationMode>('HOME-LIST')

  const onBack = useCallback(() => {
    navigation.pop()
  }, [navigation])

  useEffect(() => {
    getLocationList()
  }, [])

  useEffect(() => {
    const { mode = 'HOME-LIST' }: any = navigation.state.params
    setMode(mode)
  }, [navigation.state.params.mode])

  useEffect(() => {
    if (navigation.state.params.coordinate) {
      const { longitude, latitude } = navigation.state.params.coordinate
      setCoordinate(navigation.state.params.coordinate)
      setDefaultMapLocation(latitude, longitude)
    }
  }, [navigation.state.params.coordinate])

  const getLocationList = useCallback(() => {
    const { mode = 'HOME-LIST' }: any = navigation.state.params
    AsyncStorage.getItem(mode).then((locationsJson) => {
      const locations = locationsJson ? JSON.parse(locationsJson) : []
      if (mode === 'HOME-LIST') {
        setHomeList(locations)
      } else {
        setOfficeList(locations)
      }
    })
  }, [])

  const save = () => {
    const no = new Date().getTime()
    const concatLocations = (item: any, previous: any[]) =>
      [{ no, ...item }, ...(previous || [])].slice(0, 10)
    let list = []
    if (mode === 'HOME-LIST') {
      list = concatLocations(coordinate, homeList)
      setHomeList(list)
    } else {
      list = concatLocations(coordinate, officeList)
      setOfficeList(list)
    }
    AsyncStorage.setItem(mode, JSON.stringify(list)).then(() => {
      navigation.pop()
    })
  }

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 1000,
    })
      .then((location) => {
        webviewRef.current?.injectJavaScript(
          `ThailandPlusMap.getGeolocation(${location.latitude}, ${location.longitude})`,
        )
      })
      .catch((error) => {
        const { code, message } = error
        console.warn(code, message)
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setDefaultMapLocation = (lat: number, lon: number) => {
    if (!lat || !lon) {
      return
    }
    const js = `ThailandPlusMap.setDefaultMapLocation(${lat}, ${lon});`

    setTimeout(() => {
      webviewRef.current?.injectJavaScript(js)
    }, 1000)
  }

  const fetchData = (event: any) => {
    if (event) {
      const data = JSON.parse(event)
      const { latitude, longitude } = data
      const locale = I18n.locale
      fetch(
        `https://api.longdo.com/map/services/address?locale=${locale}&lon=${longitude}&lat=${latitude}&nopostcode=1&noelevation=1&noroad=1&noaoi=1&nowater=1&key=covid19`,
      )
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          const name = response.aoi || response.subdistrict || response.district
          if (name) {
            setCoordinate({ ...data, name })
          }
        })
    }
  }

  const debounceOnChange = _.debounce(fetchData, 400)

  const handleReceiveMessage = (event: any) => {
    if (event.nativeEvent.data) {
      debounceOnChange(event.nativeEvent.data)
    }
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
          title={
            coordinate.name || navigation.state.params.title || 'ระบุตำแหน่ง'
          }
        >
          <View style={styles.container} />
          <View style={styles.formContainer}>
            <WebView
              ref={(ref) => ((webviewRef as any).current = ref)}
              source={{ html: LONGDO_MAP_HTML }}
              style={styles.webviewContainer}
              geolocationEnabled={true}
              onMessage={handleReceiveMessage}
            />
          </View>
        </FormHeader>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonCurrentLocation}
        onPress={getCurrentLocation}
      >
        <Image
          source={require('./assets/location.png')}
          resizeMode="contain"
          style={styles.iconCurrentLocation}
        />
      </TouchableOpacity>
      <PrimaryButton
        containerStyle={[styles.button]}
        title={I18n.t('save_location')}
        onPress={save}
      />
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
  title: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES[900],
    fontFamily: FONT_BOLD,
    marginBottom: 8,
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
  field: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 0,
  },
  button: {
    bottom: 0,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#216DB8',
    height: 70,
    width: '90%',
    borderRadius: 12,
    margin: 12,
    zIndex: 100,
    padding: 10,
  },
  buttonText: {
    fontFamily: FONT_MED,
    fontSize: FONT_SIZES[600],
    lineHeight: 30,
    color: COLORS.PRIMARY_LIGHT,
  },
  buttonCurrentLocation: {
    position: 'absolute',
    bottom: 100,
    right: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  iconCurrentLocation: { width: 30, height: 30 },
  fillHeight: {
    flexGrow: 1,
  },
})
