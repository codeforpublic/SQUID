import moment from 'moment'
import 'moment/locale/th'
import React from 'react'
import { Alert, StyleSheet, TouchableHighlight } from 'react-native'
import FeatureIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from 'react-navigation-hooks'
import I18n from '../../../../i18n/i18n'
import { applicationState, useApplicationState } from '../../../state/app-state'

// Can change up to 3 picture a week.
const MAX_CHANGE_PROFILE_LIMIT = 3

// const START_PERIODS = 3 // 3 first days, freely change image
// const DEFAULT_PERIODS = 7 // 7 days per time
export const UpdateProfileButton: React.FC<{
  onChange: (uri: string) => void
  width?: number
  height?: number
  style?: React.CSSProperties
}> = ({ width, style, onChange }) => {
  const navigation = useNavigation()
  let [{ updateProfileDate, changeCount }] = useApplicationState()

  const today = moment()
  const isSameWeek = today.isSame(
    updateProfileDate || new Date().toISOString(),
    'weeks',
  )
  const days = moment().endOf('weeks').diff(today, 'days')
  const isLock = (changeCount || 0) >= MAX_CHANGE_PROFILE_LIMIT && isSameWeek

  return (
    <TouchableHighlight
      hitSlop={{ top: 48, left: 48, right: 24, bottom: 24 }}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => {
        if (isLock) {
          Alert.alert(
            I18n.t('can_not_change_picture'),
            I18n.t('can_change_pic_again_in') + (days || 1) + I18n.t('day_s'),
          )
        } else {
          navigation.navigate('MainAppFaceCamera', {
            setUri: (uri: string) => {
              applicationState.setData2({
                changeCount: (changeCount || 0) + 1,
                updateProfileDate: new Date().toISOString(),
              })
              onChange(uri)
            },
            // setUri: (uri) => {
            //   if (daySinceCreated >= 3) {
            //     Alert.alert(
            //       I18n.t('are_you_sure'),
            //       `${I18n.t(
            //         'after_changed_pic_you_will_not_be_able_to_change_until',
            //       )} ${DEFAULT_PERIODS} ${I18n.t('day_s_have_passed')}`,
            //       [
            //         { text: I18n.t('cancel'), style: 'cancel' },
            //         {
            //           text: I18n.t('confirm'),
            //           onPress: () => {
            //             onChange(uri)
            //           },
            //         },
            //       ],
            //     )
            //   } else {
            //     onChange(uri)
            //   }
            // },
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
