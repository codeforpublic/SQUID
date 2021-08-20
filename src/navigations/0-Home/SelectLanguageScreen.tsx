import I18n from 'i18n-js'
import React, { useCallback, useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { normalize } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { PrimaryButton } from '../../components/Button'
import { FONT_BOLD, FONT_MED, FONT_SIZES, COLORS } from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { WhiteBackground } from '../../components/WhiteBackground'

const SelectLanguageOption = [
  {
    label: 'English',
    value: 'en',
    title: 'Choose Language',
  },
  {
    label: 'ไทย',
    value: 'th',
    title: 'เลือกภาษา',
  },
]

type LangOptions = 'th' | 'en'

type RadioButtonType = {
  isSelected: boolean
  label: string
  value: LangOptions
  onSelect: (value: LangOptions) => void
}

const padding = normalize(16)
const PRIMARY_COLOR = COLORS.BLUE_BUTTON
const SECONDARY_COLOR = COLORS.BLACK_2

export const SelectLanguageScreen = () => {
  const [selected, setSelected] = useState<LangOptions>('en')
  const [title, setTitle] = useState(I18n.t('choose_lang'))
  const [confirmButtonLabel, setConfirmButtonLabel] = useState(I18n.t('next'))
  const navigation = useNavigation()

  const onSelect = useCallback((itemValue: LangOptions) => {
    setSelected(itemValue)
  }, [])

  const onConfirm = async () => {
    navigation.navigate('AgreementPolicy')
  }

  useEffect(() => {
    I18n.locale = selected
    setTitle(I18n.t('choose_lang'))
    setConfirmButtonLabel(I18n.t('next'))
  }, [selected])

  return (
    <WhiteBackground key={selected}>
      <View style={styles.contentContainer}>
        <View style={{ ...styles.flexRow, padding }}>
          <Text style={styles.textQuestion}>{title}</Text>
        </View>
        {SelectLanguageOption.map((option) => {
          return (
            <RadioButton
              key={`key-${option.value}`}
              isSelected={selected === option.value}
              value={option.value}
              label={option.label}
              onSelect={(itemValue: LangOptions) => onSelect(itemValue)}
            />
          )
        })}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={styles.primaryButton}
          containerStyle={styles.fullWidth}
          title={confirmButtonLabel}
          disabled={!selected}
          onPress={onConfirm}
        />
      </View>
    </WhiteBackground>
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

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding,
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
  primaryButton: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.DARK_BLUE,
    backgroundColor: COLORS.DARK_BLUE,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: padding,
  },
})
