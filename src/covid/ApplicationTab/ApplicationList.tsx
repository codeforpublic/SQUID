import React, { useState, useRef } from 'react'
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native'
import { Icon } from 'react-native-elements'
import {
  ApplicationUtils,
  useApplicationList,
} from '../../common/state/application.state'
import { COLORS, FONT_FAMILY } from '../../styles'
import { MyBackground } from '../MyBackground'
import { Logo } from '../../components/Logo'

const BlankState = ({ onCreateLink }) => {
  return (
    <View style={blankStyles.content}>
      <TouchableOpacity onPress={onCreateLink}>
        <Image source={require('../AddLocation.png')} />
      </TouchableOpacity>
      <Text style={blankStyles.title}>เริ่มต้นแบ่งปันข้อมูลของคุณ </Text>
      <Text style={blankStyles.description}>
        แจ้งตำแหน่งให้ผู้อื่นรู้ผ่าน Link{'\n'}(ยกเลิกได้)
      </Text>
    </View>
  )
}
const blankStyles = StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 40,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 28,
    lineHeight: 44,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
  description: {
    marginTop: 8,
    width: 262,
    marginBottom: 82,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
})

const ApplicationItem = ({ application }: { application: Application }) => {
  const description =
    application.type === 'link'
      ? ApplicationUtils.getLink(application)
      : application.description
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor:
            application.type === 'link' ? COLORS.BLACK_1 : COLORS.GRAY_1,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
          padding: application.logo?.includes('svg')? 5: 0,
          overflow: 'hidden'
        }}
      >
        {application.type === 'link' ? (
          <Icon name="link" type="antdesign" color={COLORS.ORANGE} />
        ) : <Logo uri={application.logo} size={application.logo.includes('svg')? 40: 50}/>}
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        {application.displayName ? (
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT_FAMILY,
              color: COLORS.GRAY_1,
            }}
          >
            {application.displayName}
          </Text>
        ) : (
          void 0
        )}
        {description ? (
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONT_FAMILY,
              color: COLORS.GRAY_1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        ) : (
          void 0
        )}
      </View>
      <Icon name={'right'} type={'antdesign'} color={'white'} size={18} />
    </View>
  )
}

export const ApplicationList = ({ navigation }) => {
  const [applications, loading, error] = useApplicationList()
  
  const onCreateLink = () => navigation.navigate('CreateLink')
  const pressRef = useRef<number[]>([])
  const onGoingToDebug = () => {
    const press = pressRef.current    
    if (press.length === 10) {
      press.shift()
    }
    press.push(new Date().getTime())

    if (press.length === 10 && press[9] - press[0] < 5000) {
      navigation.navigate('ApplicationDebug')
    }
  }
  if (loading) {
    return null
  }

  return (
    <MyBackground variant="dark">
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle="light-content" />
        {!applications || applications.length === 0 ? (
          <BlankState onCreateLink={onCreateLink} />
        ) : (
          <>
            <View
              style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 30 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1, height: 40 }}
                  onPress={onGoingToDebug}
                >
                  <Text style={styles.title}>การแบ่งปันข้อมูล</Text>
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={onCreateLink}>
                  <Icon
                    name={'plus'}
                    type={'antdesign'}
                    color={'white'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>
                รายชื่อผู้รับข้อมูลที่คุณแบ่งปันอยู่ขณะนี้
              </Text>
              <ScrollView style={{ flex: 1, paddingVertical: 20 }}>
                {applications.map(application => (
                  <TouchableOpacity
                    key={application.id}
                    onPress={() => {
                      if (application.type === 'link') {
                        navigation.navigate('YourLink', {
                          application,
                        })
                      } else {
                        navigation.navigate('ApplicationInfo', {
                          application,
                        })
                      }
                    }}
                  >
                    <ApplicationItem application={application} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
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
