import React, { useMemo, useEffect, useState } from 'react'
import { MyBackground } from '../MyBackground'
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native'
import JSONTree from 'react-native-json-tree'
import { FONT_FAMILY, COLORS } from '../../styles'
import Icon from 'react-native-vector-icons/Entypo'
import { useApplicationList } from '../../common/state/application.state'
import { useUserInfo, UserInfoUtils } from '../../common/state/userInfo.state'
import BackgroundGeolocation from 'react-native-background-geolocation'

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: 'transparent',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
}

export const ApplicationDebugScreen = ({ navigation }) => {
  const applicationList = useApplicationList()
  const userInfo = useUserInfo()
  const [location, setLocation] = useState<any>([])
  const [backgroundLocationState, setBackgroundLocationState] = useState<any>([])
  
  useEffect(() => {
    BackgroundGeolocation.getState().then(state => {
      setBackgroundLocationState(state)
    })
    BackgroundGeolocation.onLocation(
      location =>
        setLocation([location].concat(location))
    )
    BackgroundGeolocation.getCurrentPosition({
      samples: 1,
    })
  }, [])
  const json = useMemo(
    () => ({
      userData: {
        data:
          userInfo[0]?.data && UserInfoUtils.formatUserData(userInfo[0]?.data),
        loading: userInfo[1],
        error: userInfo[2],
      },
      location: {
        enabled: backgroundLocationState?.enabled,
        state: backgroundLocationState,
        location,
      },
      applicationList: {
        data: applicationList[0],
        headers: applicationList[0]?.map(app => {
          return {
            'X-FightCovid19-Apps': app.id + '.' + app.userKey,
          }
        }),
        loading: applicationList[1],
        error: applicationList[2],
      },
    }),
    [
      applicationList,
      userInfo,
      location,
    ],
  )
  return (
    <MyBackground variant="dark">
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, paddingVertical: 20 }}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 30,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 10 }}
            >
              <Icon
                name="chevron-left"
                color={COLORS.PRIMARY_LIGHT}
                size={28}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Debug mode</Text>
            <TouchableOpacity
              onPress={() => {
                Share.share({
                  message: JSON.stringify(json)
                })
              }}
              style={{ marginRight: 10 }}
            >
              <Icon
                name="share-alternative"
                type="entypo"
                color={COLORS.PRIMARY_LIGHT}
                size={28}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ paddingHorizontal: 30 }}
          >
            <JSONTree theme={theme} data={json} invertTheme={false} />
          </ScrollView>
        </View>
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
    flex: 1,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 30,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
})
