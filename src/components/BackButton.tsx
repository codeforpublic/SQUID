import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from 'react-navigation-hooks'
import Icon from 'react-native-vector-icons/Entypo'
import { COLORS } from '../styles'

export const BackButton = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity onPress={() => navigation.pop()}>
      <Icon name="chevron-thin-left" size={24} color={COLORS.PRIMARY_LIGHT} />
    </TouchableOpacity>
  )
}
