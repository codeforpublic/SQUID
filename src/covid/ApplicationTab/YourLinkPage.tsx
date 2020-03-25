import React, { Fragment } from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  StatusBar,
  Platform,
  Alert,
  ImageSourcePropType,
} from 'react-native'
import { Icon } from 'react-native-elements'
import Clipboard from '@react-native-community/clipboard'
import * as TrackingUtil from '../tracking'
import { useHUD } from '../../HudView'
import { useSafeArea } from 'react-native-safe-area-context'
import { COLORS, FONT_FAMILY } from '../../styles'
import { DangerButton } from '../Button'
import { StackActions, NavigationActions } from 'react-navigation'
import {
  ApplicationMutation,
  ApplicationUtils,
} from '../../common/state/application.state'
import { useMutation } from '@apollo/react-hooks'
import { MyBackground } from '../MyBackground'
import { refreshBackgroundTracking } from '../BackgroundTracking'

const ListItem = ({
  title,
  iconSource,
  description,
}: {
  title: string | React.ReactElement
  iconSource: ImageSourcePropType
  description?: string | React.ReactElement
}) => {
  return (
    <View style={liStyles.container}>
      <Image source={iconSource} style={liStyles.image} resizeMode="contain" />
      <View>
        <Text style={liStyles.title}>{title}</Text>
        <Text style={liStyles.description}>{description}</Text>
      </View>
    </View>
  )
}

const liStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
  },
  image: {
    width: 20,
    marginRight: 20,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
  },
  description: {
    fontFamily: FONT_FAMILY,
    marginTop: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'column',
  },
})

const PRECISION = {
  BASIC: 'basic',
  PRECISE: 'precise',
}
const RETENTION = {
  REALTIME: 'realtime',
  THIRTY_MIN: 'thirty_min',
  ONE_HOUR: 'one_hour',
  SIX_HOUR: 'six_hour',
  ONE_DAY: 'one_day',
}

export const YourLinkPage = ({ navigation }) => {
  const application: Application = navigation.state.params.application
  const { showSpinner, hide } = useHUD()
  const [deleteApplication] = useMutation(ApplicationMutation.deleteApplication)
  const link = ApplicationUtils.getLink(application)

  let retentionTitle = ''
  // switch (retention) {
  //   case RETENTION.REALTIME:
  //     retentionTitle = "ส่งข้อมูลแบบเรียลไทม์";
  //     break;
  //   case RETENTION.THIRTY_MIN:
  //     retentionTitle = "หน่วงข้อมูลทุกๆ 30 นาที";
  //     break;
  //   case RETENTION.ONE_HOUR:
  //     retentionTitle = "หน่วงข้อมูลทุกๆ 1 ชม.";
  //     break;
  //   default:
  //     retentionTitle = "หน่วงข้อมูลทุกๆ 1 วัน";
  //     break;
  // }

  let precisionTitle = 'โหมด Precision'
  let precisionDescription =
    'แชร์รายละเอียดถึงตำแหน่งที่อยู่\n' +
    'ข้อมูลการขยับมือถือ ข้อมูลแบตเตอรี่มือถือ\n' +
    'และข้อมูลความถูกต้องแบบละเอียด'

  if (application.permissions?.includes('location:basic')) {
    precisionTitle = 'โหมด Basic'
    precisionDescription = 'แชร์เฉพาะชื่อสถานที่ และข้อมูลความถูกต้อง'
  }

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
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 20 }}
            onPress={() => {
              navigation.goBack()
            }}
            // style={{ marginRight: 20 }}
          >
            <Icon name="left" type="antdesign" color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Link ของคุณ</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(link)
            }}
          >
            <Icon name="map" type="feather" color="white" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {application.displayName ? (
            <Fragment>
              <Text style={styles.inputLabel}>ชื่อ Link</Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.inputTransparentContainer,
                ]}
              >
                <Text style={styles.input}>{application.displayName}</Text>
              </View>
            </Fragment>
          ) : null}
          <Text style={styles.inputLabel}>URL</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Share.share({
                title: application.displayName,
                message: link,
                url: link,
              })
            }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.input} ellipsizeMode="tail" numberOfLines={1}>
                {link}
              </Text>
              <Icon name="sharealt" type="antdesign" color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.configTitle}>การตั้งค่าที่กำหนดไว้</Text>
        </View>
        <ListItem
          iconSource={require('../PrecisionIcon.png')}
          title={precisionTitle}
          description={precisionDescription}
        />
        <DangerButton
          title="ยกเลิก"
          onPress={async () => {
            showSpinner()
            await deleteApplication({
              variables: {
                applicationId: application.id,
              },
            })
            await refreshBackgroundTracking()
            hide()
            Alert.alert('ลิงค์นี้ได้ถูกลบแล้ว')
            let action = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'MainTab',
                }),
              ],
              key: null,
            })
            navigation.dispatch(action)
          }}
          style={{
            width: '100%',
            marginTop: 50,
            alignSelf: 'center',
          }}
        />
        {/* <ListItem
        iconSource={require("../ClockIcon.png")}
        title={retentionTitle}
      /> */}
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
    flex: 1,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
  inputTransparentContainer: {
    marginHorizontal: -10,
    marginTop: 0,
    marginBottom: 20,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginTop: 8,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    height: 48,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
  },
  inputLabel: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  input: {
    flex: 1,
    fontFamily: FONT_FAMILY,
    color: COLORS.WHITE,
    borderWidth: 0,
    fontSize: 14,
  },
  content: {
    marginTop: 60,
  },
  configTitle: {
    marginTop: 30,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.WHITE,
    opacity: 0.6,
  },
})
