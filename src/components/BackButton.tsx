import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import Icon from 'react-native-vector-icons/Entypo'
import { COLORS } from '../styles'

export const BackButton = ({ onPress }: { onPress?: any }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => navigation.pop()}
      hitSlop={{ top: -10, left: -10, right: -10, bottom: -10 }}
    >
      <Icon name="chevron-thin-left" size={24} color={COLORS.PRIMARY_DARK} />
    </TouchableOpacity>
  )
}
