import React, { useState, useEffect, useCallback } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage'

export const SetLocationHome = () => {
  const navigation = useNavigation()
  const [home, setHome] = useState(null)
  const [office, setOffice] = useState(null)
  const loadLocation = useCallback(async () => {
    const homeLocation = await AsyncStorage.getItem('HOME-LIST');
    setHome(homeLocation);

    const officeLocation = await AsyncStorage.getItem('OFFICE-LIST');
    setOffice(officeLocation);
  }, [home, office]);

  useEffect(() => {
    loadLocation();
  }, []);
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
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Set Location</Text>
            </View>

            <View style={styles.settingsSection}>
              <TouchableHighlight
                onPress={() => navigation.navigate('SetLocationMap', {
                  title: 'กำหนดที่อยู่บ้านของคุณ',
                  mode: 'HOME-LIST',
                  onBack: () => {
                    navigation.pop()
                  },
                  backIcon: 'close'
                })}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionText}>
                    กำหนดที่อยู่บ้านของคุณ <Text style={{ color: 'red', fontSize: FONT_SIZES[400] }}>{home ? 'ระบุแล้ว' : ''}</Text>
                  </Text>
                </View>
              </TouchableHighlight>

              {<TouchableHighlight
                onPress={() => navigation.navigate('SetLocationMap', {
                  title: 'กำหนดที่อยู่ที่ทำงานของคุณ',
                  mode: 'OFFICE-LIST',
                  onBack: () => {
                    navigation.pop()
                  },
                  backIcon: 'close'
                })}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionText}>
                    กำหนดที่อยู่ที่ทำงานของคุณ <Text style={{ color: 'red', fontSize: FONT_SIZES[400] }}>{office ? 'ระบุแล้ว' : ''}</Text>
                  </Text>
                </View>
              </TouchableHighlight>}

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
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
