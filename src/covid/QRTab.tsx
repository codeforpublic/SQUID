import React, { Fragment, useEffect } from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { COLORS, FONT_FAMILY } from '../styles'
import { MyBackground } from './MyBackground'
import {
  useApplication,
  useApplicationList,
  useQRCode,
} from '../common/state/application.state'
import { DEFAULT_APPLICATION_ID } from './const'
import Carousel from 'react-native-snap-carousel'
import { useIsFocused, useNavigation } from 'react-navigation-hooks'
import useAppState from 'react-native-appstate-hook'

const QRCodeImage = ({ application }: { application: Application }) => {
  const qrLink = useQRCode(application)    
  
  return (
    <View>
      <View
        style={{
          backgroundColor: 'white',
          width: 252,
          height: 252,
          alignSelf: 'center',
          borderRadius: 26,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {qrLink ? (
          <Image
            source={{ uri: qrLink }}
            style={{
              backgroundColor: 'white',
              width: 252,
              height: 252,
              borderRadius: 26,
            }}
          />
        ) : (
          <ActivityIndicator color={COLORS.BLACK_1} size="large"/>
        )}
      </View>
      {application ? (
        <Text
          style={{
            marginTop: 30,
            textAlign: 'center',
            fontFamily: FONT_FAMILY,
            color: 'white',
            fontWeight: '600',
            fontSize: 24,
          }}
        >
          {application.displayName}
        </Text>
      ) : null}
    </View>
  )
}

export const QRTab = () => {
  useAppState()
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [applications, loading] = useApplicationList()
  const filterApplications = applications?.filter(
    app => app.type === 'campaign',
  )
  const appId = navigation.state?.params?.applicationId
  const firstItem = appId
    ? filterApplications?.findIndex(app => app.id === appId)
    : 0

  return (
    <MyBackground variant="dark">
      <View
        style={{
          paddingHorizontal: 30,
          paddingVertical: 20,
          paddingTop: 20,
          flex: 1,
        }}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>QR Code ของฉัน</Text>
        </View>
        <View style={styles.content}>
          {/* {defaultApplication && <QRCodeImage application={defaultApplication} />} */}
          {isFocused && filterApplications && (
            <Carousel
              containerCustomStyle={{
                height: '100%',
              }}
              firstItem={firstItem}
              contentContainerCustomStyle={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
              data={filterApplications}
              renderItem={({ item, index }) => (
                <QRCodeImage key={item.id} application={item} />
              )}
              sliderHeight={Dimensions.get('window').height - 100}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={252}
            />
          )}
        </View>
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
})
