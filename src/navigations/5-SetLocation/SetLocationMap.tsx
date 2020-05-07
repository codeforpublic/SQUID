import React, { useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'

import MapView, { Marker } from 'react-native-maps';

export const SetLocationMap = () => {
  const navigation = useNavigation()
  const [coordinate, setCoordinate] = useState({latitude: 13.7698018, longitude: 100.6335734 })

  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <Text>SET LOCATION MAP</Text>
          <View style={styles.container}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 13.7698018,
                longitude: 100.6335734,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker draggable
                coordinate={coordinate}
                onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
              />
            </MapView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
})
