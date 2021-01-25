import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import { StyleSheet, TouchableHighlight, Alert } from 'react-native'
import FeatureIcon from 'react-native-vector-icons/Feather'
import 'moment/locale/th'
import { useNavigation } from 'react-navigation-hooks'
import { applicationState, useApplicationState } from '../../../state/app-state'
import moment from 'moment'

import I18n from '../../../../i18n/i18n'

const START_PERIODS = 3 // 3 first days, freely change image
const DEFAULT_PERIODS = 7 // 7 days per time
const TIME_TO_CHANGE_PICTURE: number = 3
export const UpdateProfileButton = ({ width, style, onChange }) => {
  const navigation = useNavigation()
  const [data] = useApplicationState()
  let expiredDate: string = data.expiredDate!
  let currentDate: Date = new Date()
  let timeToChangePicture: number = moment().isAfter(moment(data.expiredDate))
    ? 0
    : data.timeToChangePicture!
  let timeCounting: number = Math.abs(moment().diff(expiredDate, 'h')) + 1

  console.log(moment().isAfter(moment(data.expiredDate)))

  const isLock =
    new Date(expiredDate).getTime() <= currentDate.getTime() ||
    timeToChangePicture >= TIME_TO_CHANGE_PICTURE

  const countingChangePicture = () => {
    timeToChangePicture++
    applicationState.setData('timeToChangePicture', timeToChangePicture)
  }

  //no solution for unlock
  // const resetChangePicture = () => {
  //   timeToChangePicture = 0
  //   const newExpiredDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
  //   applicationState.setData('expiredDate', newExpiredDate.toISOString())
  //   applicationState.setData('timeToChangePicture', timeToChangePicture)
  // }

  return (
    <TouchableHighlight
      hitSlop={{ top: 48, left: 48, right: 24, bottom: 24 }}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => {
        if (isLock) {
          Alert.alert(
            I18n.t('can_not_change_picture'),
            'คุณไม่สามารถเปลี่ยนรูปได้ในขณะนี',
            // I18n.t('day_s'),
          )
        } else {
          Alert.alert(
            I18n.t('can_not_change_picture'),
            TIME_TO_CHANGE_PICTURE - (timeToChangePicture + 1) !== 0
              ? 'คุณจะสามารถเปลี่ยนรูปได้อีก ' +
                  (TIME_TO_CHANGE_PICTURE - (timeToChangePicture + 1)) +
                  ' ครั้ง หรือ ภายใน ' +
                  timeCounting +
                  ' ชั่วโมง หลังจากนี้คุณจะไม่สามารถเปลี่ยนรูปได้อีก'
              : 'หลังจากการเปลี่ยนรูปครั้งนี้ คุณจะไม่สามารถเปลี่ยนรูปได้อีก',
            // I18n.t('day_s'),
          )
          navigation.navigate('MainAppFaceCamera', {
            setUri: (uri: string) => {
              countingChangePicture()
              onChange(uri)
            },
          })
        }
      }}
      style={[
        styles.container,
        {
          width: width,
          height: width,
          borderRadius: Math.floor(width / 2),
        },
        style,
      ]}
    >
      <FeatureIcon
        name={isLock ? 'lock' : 'camera'}
        size={Math.floor((60 / 100) * width)}
      />
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
})
