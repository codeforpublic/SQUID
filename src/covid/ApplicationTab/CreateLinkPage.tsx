import React, { useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native'
import { Input } from 'react-native-elements'
import { PrimaryButton } from '../Button'
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import { StackActions, NavigationActions } from 'react-navigation'
import { useSafeArea } from 'react-native-safe-area-context'
import { COLORS, FONT_FAMILY } from '../../styles'
import { CheckBoxItem } from '../../CheckBoxItem'
import { useMutation } from '@apollo/react-hooks'
import { ApplicationMutation } from '../../common/state/application.state'
import * as TrackingUtil from '../tracking'
import { useHUD } from '../../HudView'
import nanoid from 'nanoid'
import BackgroundGeolocation from 'react-native-background-geolocation'
import { MyBackground } from '../MyBackground'
import { refreshBackgroundTracking } from '../BackgroundTracking'

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

const generateId = async () => {
  return 'link:' + (await nanoid())
}

export const CreateLinkPage = ({ navigation }) => {
  const [saveApplication] = useMutation(ApplicationMutation.saveApplication)
  const { showSpinner, hide } = useHUD()

  const [linkName, setLinkName] = useState('')
  const [precision, setPrecision] = useState(PRECISION.BASIC)
  const [retention, setRetention] = useState(RETENTION.REALTIME)

  const resetTo = (routeName: string, params?: Object) => {
    let action = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
      key: null,
    })
    navigation.dispatch(action)
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
          <Text style={styles.title}>สร้าง Link</Text>
          <TouchableOpacity
            // hitSlop={{ top: 20, bottom: 20, left: 50, right: 20 }}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Icon name="left" type="antdesign" color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          <Input
            label="ตั้งชื่อ"
            placeholder="eg. สำหรับให้นายจ้าง"
            value={linkName}
            onChangeText={setLinkName}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
          <Text style={styles.configTitle}>ความละเอียด</Text>
          <CheckBoxItem
            title={'Basic'}
            checked={precision === PRECISION.BASIC}
            onPress={() => setPrecision(PRECISION.BASIC)}
            description="แชร์เฉพาะชื่อสถานที่ และข้อมูลความถูกต้อง"
          />
          <CheckBoxItem
            title={'Precision'}
            checked={precision === PRECISION.PRECISE}
            onPress={() => setPrecision(PRECISION.PRECISE)}
            description={
              'แชร์ละเอียดถึงตำแหน่งที่อยู่\n' +
              'ข้อมูลการขยับมือถือ ข้อมูลแบตเตอรี่มือถือ\n' +
              'และข้อมูลความถูกต้องแบบละเอียด'
            }
          />
          {/* <Text style={styles.configTitle}>การหน่วงข้อมูล</Text>
        <CheckBoxItem
          title={"เรียลไทม์ ไม่ต้องหน่วงข้อมูล"}
          checked={retention === RETENTION.REALTIME}
          onPress={() => setRetention(RETENTION.REALTIME)}
        />
        <CheckBoxItem
          title={"30 นาที"}
          checked={retention === RETENTION.THIRTY_MIN}
          onPress={() => setRetention(RETENTION.THIRTY_MIN)}
        />
        <CheckBoxItem
          title={"1 ชั่วโมง"}
          checked={retention === RETENTION.ONE_HOUR}
          onPress={() => setRetention(RETENTION.ONE_HOUR)}
        />
        <CheckBoxItem
          title={"6 ชั่วโมง"}
          checked={retention === RETENTION.SIX_HOUR}
          onPress={() => setRetention(RETENTION.SIX_HOUR)}
        />
        <CheckBoxItem
          title={"1 วัน"}
          checked={retention === RETENTION.ONE_DAY}
          onPress={() => setRetention(RETENTION.ONE_DAY)}
        /> */}
        </ScrollView>
        <PrimaryButton
          title="สร้าง Link"
          icon={{ name: 'link', type: 'antdesign', color: 'white' }}
          iconRight
          style={{ width: 'auto' }}
          onPress={async () => {
            const id = await generateId()
            const application = {
              id,
              type: 'link',
              displayName: linkName || 'ลิงค์สำหรับแชร์',
              permissions:
                precision === PRECISION.BASIC
                  ? ['location:basic']
                  : ['location:real_time'],
            }
            showSpinner()
            await saveApplication({
              variables: {
                application,
              },
            })
            await refreshBackgroundTracking()
            hide()
            await BackgroundGeolocation.getCurrentPosition({
              samples: 1,
              persist: true,
            })
            navigation.replace('YourLink', {
              application,
            })
          }}
        />
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
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 44,
    color: COLORS.GRAY_1,
    textAlign: 'center',
  },
  inputContainer: {
    marginHorizontal: -10,
    marginTop: 8,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  inputLabel: {
    marginHorizontal: -10,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
  },
  input: { fontFamily: FONT_FAMILY, borderWidth: 0, fontSize: 14 },
  content: {
    marginVertical: 20,
    flex: 1,
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
