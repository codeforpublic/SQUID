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
import MapViewAnimated, { PROVIDER_GOOGLE, MarkerAnimated } from 'react-native-maps';
import { normalize } from 'react-native-elements';
import { PrimaryButton } from '../../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapHistoryList from './MapHistoryList';
import Icon from 'react-native-vector-icons/FontAwesome5';
interface Coordinate {
  name?: string;
  latitude: number;
  longitude: number;
}
interface ListCoordinate {
  no: number;
  name?: string;
  latitude: number;
  longitude: number;
}
const padding = normalize(18)

const Footer = styled(View)({
  alignItems: 'center',
  marginVertical: 12,
  paddingHorizontal: padding
})
export const SetLocationMap = ({ navigation }) => {
  const [coordinate, setCoordinate] = useState<Coordinate>({ latitude: 13.7698018, longitude: 100.6335734 });
  const inset = useSafeArea()
  const [homeList, setHomeList] = useState<ListCoordinate[]>([])
  const [officeList, setOfficeList] = useState<ListCoordinate[]>([]);
  const [mode, setMode] = useState<string>('HOME_LIST');

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
      const homes = homeLocation ? JSON.parse(homeLocation) : [];
      setHomeList(homes);
    } else {
      const officeLocation = await AsyncStorage.getItem('OFFICE-LIST');
      const offices = officeLocation ? JSON.parse(officeLocation) : [];
      setOfficeList(offices);
    }
  }, []);

  useEffect(() => {
    currentLocation();
    getLocationList();
  }, [])

  useEffect(() => {
    const { mode = 'HOME-LIST' } = navigation.state.params;
    setMode(mode);
  }, [navigation.state.params.mode])

  const save = async () => {
    const no = new Date().getTime();
    if (mode === 'HOME-LIST') {
      const list = [{ no, ...coordinate }, ...(homeList || [])];
      setHomeList(list);
      await AsyncStorage.setItem(mode, JSON.stringify(list));
    } else {
      const list = [{ no, ...coordinate }, ...officeList];
      setOfficeList(list);
      await AsyncStorage.setItem(mode, JSON.stringify(list));
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
          keyboardShouldPersistTaps={'always'}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{navigation.state.params.title || 'ระบุตำแหน่ง'}</Text>
          </View>
          <View style={{ flex: 1, position: 'relative' }} >
            <View style={{ position: 'absolute', zIndex: 99 }}>
              <Icon name="map-marker-alt" size={20} color="rgb(229,86,72)" style={{ lineHeight: 40, paddingLeft: 5 }} />
            </View>
            <View style={{ width: '100%' }}>
              <GooglePlacesAutocomplete
                placeholder=''
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (!details.geometry.location) { return; }
                  setCoordinate({ name: details.name, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
                }}
                query={{
                  key: 'AIzaSyCINS2dyuBipK8MZzOQnzyKdrS2I1_b5I4',
                  language: 'th',
                  components: 'country:th'
                }}
                styles={{
                  textInputContainer: {
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    paddingLeft: 10,
                    height: 40,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  },
                  description: {
                    fontWeight: 'bold',
                    backgroundColor: '#FFFFFF',
                  },
                  listView: {
                    backgroundColor: '#FFFFFF',
                  }
                }}
                enablePoweredByContainer={false}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
              />
            </View>
          </View>
          <View style={styles.container}>
            <MapViewAnimated
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}
              zoomEnabled={true}
              zoomTapEnabled={true}
              zoomControlEnabled={true}
              toolbarEnabled={true}
              region={{ ...coordinate, latitudeDelta: 0.015, longitudeDelta: 0.0121 }}
              initialRegion={{ ...coordinate, latitudeDelta: 0.015, longitudeDelta: 0.0121 }}
              onPress={(e) => setCoordinate({ ...e.nativeEvent.coordinate })}>
              <MarkerAnimated draggable
                coordinate={coordinate}
                onDragEnd={(e) => setCoordinate({ ...e.nativeEvent.coordinate })}
              />
            </MapViewAnimated>
          </View>
          <View style={styles.historyContainer}>
            <MapHistoryList onSelectHistoryItem={onSelectHistoryItem} items={mode === 'HOME-LIST' ? homeList : officeList} />
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
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  }
})
