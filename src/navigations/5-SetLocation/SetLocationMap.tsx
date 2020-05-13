import React, { useState, useEffect, useCallback } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MyBackground } from '../../components/MyBackground';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { backgroundTracking } from '../../services/background-tracking';
import styled from '@emotion/native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { normalize } from 'react-native-elements';
import { PrimaryButton } from '../../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapHistoryList from './MapHistoryList';

interface Coordinate {
  latitude: number;
  longitude: number;
}
interface ListCoordinate {
  no: number;
  latitude: number;
  longitude: number;
}
const padding = normalize(18)
const listOfHomeLocation: ListCoordinate[] = [];
const listOfOfficeLocation: ListCoordinate[] = [];

const Footer = styled(View)({
  alignItems: 'center',
  marginVertical: 12,
  paddingHorizontal: padding
})

export const SetLocationMap = ({ navigation }) => {
  const [coordinate, setCoordinate] = useState<Coordinate>({ latitude: 13.7698018, longitude: 100.6335734 });
  const inset = useSafeArea()
  const [homeList, setHomeList] = useState<ListCoordinate[]>(listOfHomeLocation)
  const [officeList, setOfficeList] = useState<ListCoordinate[]>(listOfOfficeLocation)

  const currentLocation = useCallback(async () => {
    try {
      const location = await backgroundTracking.getLocation();
      setCoordinate({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getLocationList = useCallback(async () => {
    const { mode = 'HOME-LIST' } = navigation.state.params;
    if (mode === 'HOME-LIST') {
      const homeLocation = await AsyncStorage.getItem('HOME-LIST');
      setHomeList(JSON.parse(homeLocation));
    } else {
      const officeLocation = await AsyncStorage.getItem('OFFICE-LIST');
      setOfficeList(JSON.parse(officeLocation));
    }
  }, []);

  useEffect(() => {
    currentLocation();
    getLocationList();
  }, [])

  const save = async () => {
    const { mode = 'HOME-LIST' } = navigation.state.params;
    console.log(mode, JSON.stringify(coordinate));
    if (mode === 'HOME-LIST') {
      listOfHomeLocation.push({ no: listOfHomeLocation.length + 1, ...coordinate });
      setHomeList(listOfHomeLocation)
      await AsyncStorage.setItem(mode, JSON.stringify(homeList));
    } else {
      listOfOfficeLocation.push({ no: listOfOfficeLocation.length + 1, ...coordinate });
      setOfficeList(listOfOfficeLocation)
      await AsyncStorage.setItem(mode, JSON.stringify(officeList));
    }
    navigation.pop()
  }

  const footer = (
    <Footer style={{ paddingBottom: inset.bottom }}>
      <PrimaryButton
        title={'บันทึก'}
        style={{ width: '100%' }}
        containerStyle={{ width: '100%' }}
        disabled={!coordinate}
        onPress={save}
      />
    </Footer>
  );
  const fixedFooter = Dimensions.get('window').height > 700;

  const onSelectHistoryItem = (item) => {
    setCoordinate({ latitude: item.latitude, longitude: item.longitude });
  }

  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <ScrollView
          keyboardShouldPersistTaps={true}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{navigation.state.params.title || 'ระบุตำแหน่ง'}</Text>
          </View>
          <View style={{ flex: 1 }} >
            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed={false}
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (!details.geometry.location) { return; }
                setCoordinate({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
              }}
              query={{
                key: 'AIzaSyCINS2dyuBipK8MZzOQnzyKdrS2I1_b5I4',
                language: 'th',
                components: 'country:th'
              }}
              styles={{
                textInputContainer: {
                  width: '100%',
                },
                description: {
                  fontWeight: 'bold',
                },
              }}
              enablePoweredByContainer={false}
              nearbyPlacesAPI='GooglePlacesSearch'
              debounce={300}
            />
          </View>
          <View style={styles.container}>
            <MapView
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              showsUserLocation={true}
              region={{ ...coordinate, latitudeDelta: 0.015, longitudeDelta: 0.0121 }}
              initialRegion={{ ...coordinate, latitudeDelta: 0.015, longitudeDelta: 0.0121 }}>
              <Marker draggable
                coordinate={coordinate}
                onDragEnd={(e) => setCoordinate({ ...e.nativeEvent.coordinate })}
              />
            </MapView>
          </View>
          <View style={styles.historyContainer}>
            <MapHistoryList onSelectHistoryItem={onSelectHistoryItem} items={navigation.state.params.mode === 'HOME-LIST' ? homeList : officeList} />
          </View>
          {fixedFooter ? null : footer}
        </ScrollView>
        {fixedFooter ? footer : null}
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeader: {
    height: 56,
    justifyContent: 'flex-end',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: '#AAAAAA',
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_FAMILY
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  horizontalRow: {
    flexDirection: 'row',
  },
  leftArea: {
    flex: 1,
  },
  rightArea: {
    justifyContent: 'flex-start',
  },
  sectionText: {
    fontSize: FONT_SIZES[600],
    color: '#000000',
    fontFamily: FONT_FAMILY,
  },
  sectionDescription: {
    marginTop: 4,
    fontSize: FONT_SIZES[500],
    color: '#888888',
    fontFamily: FONT_FAMILY,
  },
  mediumText: {
    fontSize: FONT_SIZES[600],
    color: '#000000',
  },
  largeText: {
    fontSize: FONT_SIZES[700],
    color: '#000000',
    fontFamily: FONT_FAMILY,
  },
  sectionTitle: {
    fontSize: FONT_SIZES[700],
    fontWeight: '600',
    color: '#000000',
    fontFamily: FONT_FAMILY,
  },
  scrollView: {},
  historyContainer: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  }
})
