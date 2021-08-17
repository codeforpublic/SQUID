import I18n from 'i18n-js'
import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { normalize } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { PrimaryButton } from '../../components/Button'
import { FONT_BOLD, FONT_MED, FONT_SIZES, COLORS } from '../../styles'
import { useNavigation } from '@react-navigation/native'

type SelectValueType = boolean | string

type RadioButtonType = {
  isSelected: boolean
  label: string
  value: SelectValueType
  onSelect: (value: SelectValueType) => void
}

const padding = normalize(16)
const PRIMARY_COLOR = COLORS.BLUE_BUTTON
const SECONDARY_COLOR = COLORS.BLACK_2

export const OnboardEnterQuestion = () => {
  const [selected, setSelected] = useState<SelectValueType>(true)
  const onChange = (value: SelectValueType) => setSelected(value)
  const navigation = useNavigation()

  const onSelect = useCallback((itemValue: SelectValueType) => {
    onChange(itemValue)
  }, [])

  const selectOptions = [
    { value: true, label: I18n.t('yes') },
    { value: false, label: I18n.t('no') },
  ]

  return (
    <View style={styles.container}>
      <PageBackButton label={I18n.t('select_image_profile')} />
      <View style={styles.contentContainer}>
        <View style={{ ...styles.flexRow, padding }}>
          <Text style={styles.textQuestion}>{I18n.t('planning_to_enter_thailand_question')}</Text>
        </View>
        {selectOptions.map((option) => {
          return (
            <RadioButton
              key={`key-${option.value}`}
              isSelected={selected === option.value}
              value={option.value}
              label={option.label}
              onSelect={(itemValue: SelectValueType) => onSelect(itemValue)}
            />
          )
        })}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={styles.fullWidth}
          containerStyle={styles.fullWidth}
          title={I18n.t('confirm')}
          disabled={!selected}
          onPress={() => navigation.navigate('OnboardCoeChecking')}
        />
      </View>
    </View>
  )
}

const RadioButton = (props: RadioButtonType) => {
  const { label, value, isSelected, onSelect } = props

  const buttonContainerStyle = () => {
    const coreStyle = styles.buttonContainer
    return !isSelected ? coreStyle : { ...coreStyle, ...styles.buttonContainerIsSelected }
  }
  const buttonTextStyle = () => {
    const coreStyle = { ...styles.label, flex: 1 }
    return { ...coreStyle, color: isSelected ? PRIMARY_COLOR : SECONDARY_COLOR }
  }
  return (
    <TouchableOpacity onPress={() => onSelect(value)}>
      <View style={buttonContainerStyle()}>
        <Text style={buttonTextStyle()}>{label}</Text>
        {isSelected ? <Icon name='check' size={20} color={PRIMARY_COLOR} /> : null}
      </View>
    </TouchableOpacity>
  )
}

type PageBackButtonPropsType = {
  onPress?: () => void
  label: string | I18n.TranslateOptions | undefined
}

export const PageBackButton = (props: PageBackButtonPropsType) => {
  const { onPress, label } = props
  const navigation = useNavigation()

  return (
    <TouchableOpacity style={styles.flexRow} onPress={() => onPress || navigation.goBack()}>
      <Icon name='arrow-circle-left' size={20} color={PRIMARY_COLOR} style={{ paddingRight: 4 }} />
      <Text style={{ color: PRIMARY_COLOR }}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  container: {
    backgroundColor: '#fff',
    padding,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainerIsSelected: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    marginBottom: 7,
  },
  buttonContainer: {
    paddingVertical: 12,
    borderColor: '#E6F2FA',
    borderWidth: 1,
    marginBottom: 6,
    paddingHorizontal: padding,
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
  textQuestion: {
    color: PRIMARY_COLOR,
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
  },
  footer: {
    alignItems: 'center',
    marginBottom: 12,
  },
})
