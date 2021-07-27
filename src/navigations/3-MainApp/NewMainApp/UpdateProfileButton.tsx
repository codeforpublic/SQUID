import moment from 'moment'
import 'moment/locale/th'
import React from 'react'
import { StyleSheet, TouchableHighlight, ViewStyle } from 'react-native'
import FeatureIcon from 'react-native-vector-icons/Feather'
import { MAX_CHANGE_PROFILE_LIMIT } from '.'
import { useApplicationState } from '../../../state/app-state'

// const START_PERIODS = 3 // 3 first days, freely change image
// const DEFAULT_PERIODS = 7 // 7 days per time
export const UpdateProfileButton: React.FC<{
  onChange: (uri: string) => void
  width: number
  style?: ViewStyle
}> = ({ width, style }) => {
  let [{ updateProfileDate, changeCount }] = useApplicationState()

  const today = moment()
  const isSameWeek = today.isSame(updateProfileDate || new Date().toISOString(), 'weeks')
  const isLock = (changeCount || 0) >= MAX_CHANGE_PROFILE_LIMIT && isSameWeek
  if (!isLock) {
    return null
  } else {
    return (
      <TouchableHighlight
        hitSlop={{ top: 48, left: 48, right: 24, bottom: 24 }}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
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
        <FeatureIcon name={isLock ? 'lock' : 'camera'} size={Math.floor((60 / 100) * width)} />
      </TouchableHighlight>
    )
  }
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
