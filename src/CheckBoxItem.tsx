import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from './styles'

export const CheckBoxItem = ({
  title,
  onPress,
  description,
  checked,
}: {
  title: string | React.ReactElement
  onPress: (e: any) => any
  description?: string | React.ReactElement
  checked?: boolean
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={checked}>
      <View style={liStyles.container}>
        <View style={liStyles.iconContainer}>
          {checked ? (
            <Icon
              style={liStyles.icon}
              type="font-awesome"
              name="dot-circle-o"
              color={COLORS.ORANGE}
            />
          ) : (
            <Icon
              style={liStyles.icon}
              type="font-awesome"
              name="circle-o"
              color={COLORS.GRAY_2}
            />
          )}
        </View>
        <View>
          <Text style={liStyles.title}>{title}</Text>
          {description && (
            <Text style={liStyles.description}>{description}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const liStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 20,
  },
  icon: {
    width: 20,
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
