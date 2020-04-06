import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS } from '../styles'

export const BackButton = ({ onPress, backIcon="arrow-left" }: { onPress?: any, backIcon?: string }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => navigation.pop()}
      hitSlop={{ top: -10, left: -10, right: -10, bottom: -10 }}
    >
      <Icon name={backIcon} size={32} color={COLORS.BLACK_3} />
    </TouchableOpacity>
  )
}
