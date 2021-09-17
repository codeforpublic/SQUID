import React from 'react'
import I18n from 'i18n-js'
import { useNavigation } from '@react-navigation/native'
import { Text, TouchableOpacity, StyleSheet, View, StyleProp } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS, FONT_MED, FONT_SIZES } from '../../../styles'

const PRIMARY_COLOR = COLORS.BLUE_BUTTON

type PageBackButtonPropsType = {
  onPress?: () => void
  label: string | I18n.TranslateOptions | undefined
}

export const PageBackButton = (props: PageBackButtonPropsType) => {
  const { onPress, label } = props
  const navigation = useNavigation()

  return (
    <View style={{ padding: 16 }}>
      <TouchableOpacity style={styles.flexRow} onPress={() => onPress || navigation.goBack()}>
        <Icon name='arrow-circle-left' size={20} color={PRIMARY_COLOR} style={{ paddingRight: 4 }} />
        <Text style={{ color: PRIMARY_COLOR, fontFamily: FONT_MED, fontSize: FONT_SIZES[500] }}>{label}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingVertical: 12,
    borderColor: '#E6F2FA',
    borderWidth: 1,
    marginBottom: 6,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONT_MED,
    fontSize: FONT_SIZES[600],
  },
})
