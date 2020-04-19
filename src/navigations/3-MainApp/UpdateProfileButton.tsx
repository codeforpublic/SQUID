import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import { StyleSheet, TouchableHighlight, Alert } from 'react-native'
import FeatureIcon from 'react-native-vector-icons/Feather'
import 'moment/locale/th'
import { useNavigation } from 'react-navigation-hooks'
import { useApplicationState } from '../../state/app-state'
import moment from 'moment'

const START_PERIODS = 3 // 3 first days, freely change image
const DEFAULT_PERIODS = 7 // 7 days per time
export const UpdateProfileButton = ({ width, style, onChange }) => {
  const navigation = useNavigation()
  const [data] = useApplicationState()
  const daySinceCreated = moment().diff(data.createdDate, 'days')
  const daySinceUpdated = moment().diff(data.updateProfileDate, 'days')
  const isLock = !(
    daySinceCreated < START_PERIODS || daySinceUpdated >= DEFAULT_PERIODS
  )

  return (
    <TouchableHighlight
      hitSlop={{ top: 48, left: 48, right: 24, bottom: 24 }}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => {
        if (isLock) {
          const day = DEFAULT_PERIODS - daySinceUpdated
          Alert.alert(
            'ไม่สามารถเปลี่ยนรูปได้',
            'คุณจะสามารถเปลี่ยนรูปได้อีกใน ' + day + ' วัน',
          )
        } else {
          navigation.navigate('MainAppFaceCamera', {
            setUri: uri => {
              if (daySinceCreated >= 3) {
                Alert.alert(
                  'คุณแน่ใจไหม ?',
                  `เมื่อคุณเปลี่ยนรูปแล้ว ในอีก ${DEFAULT_PERIODS} วันคุณจะไม่สามารถเปลี่ยนรูปได้อีกครั้ง`,
                  [
                    { text: 'ยกเลิก', style: 'cancel' },
                    {
                      text: 'ยืนยัน',
                      onPress: () => {
                        onChange(uri)
                      },
                    },
                  ],
                )
              } else {
                onChange(uri)
              }
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
