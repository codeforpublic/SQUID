import React, { useState, useCallback } from 'react'
import styled from '@emotion/native'
import { Text, View, TouchableOpacity } from 'react-native'
import { FONT_FAMILY, FONT_SIZES, FONT_MED } from '../styles'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { normalize } from 'react-native-elements'

const padding = normalize(16)
const Container = styled(View)({
  padding: padding,
})

const SelectItemContainer = styled(View)(({ isSelected }) => ({
  paddingVertical: 12,
  paddingHorizontal: padding,
  backgroundColor: 'white',
  borderColor: isSelected ? '#216DB8' : '#E6F2FA',
  borderWidth: isSelected ? 2 : 1,
  borderRadius: 5,
  marginBottom: isSelected ? 6 : 7,
  shadowOffset: { width: 1, height: 2 },
  shadowColor: 'black',
  shadowOpacity: 0.1,
  flexDirection: 'row',
  // justifyContent: 'space-between',
  alignItems: 'center',
}))
const SelectItemLabel = styled(Text)({
  fontFamily: FONT_MED,
  fontSize: FONT_SIZES[600],
})

interface Props {
  multiple?: boolean
  options: {
    value: any
    label: string
  }[]
  style?: any
  value: any[]
  defaultValue: any
  onChange: (value: any) => void
}

const SelectItem = ({ label, value, isSelected, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(value)} activeOpacity={0.6}>
      <SelectItemContainer isSelected={isSelected}>
        <SelectItemLabel style={{ color: isSelected ? '#216DB8' : '#0C2641', flex: 1 }}>{label}</SelectItemLabel>
        <FeatherIcon
          name={isSelected ? 'check-circle' : 'circle'}
          size={20}
          color={isSelected ? '#216DB8' : '#0C2641'}
        />
      </SelectItemContainer>
    </TouchableOpacity>
  )
}

export const QuestionaireSelect = ({ multiple, style, options, value, defaultValue, onChange }: Props) => {
  const onSelect = useCallback(
    (itemValue) => {
      if (multiple) {
        if (!value || itemValue === 'none') {
          onChange([itemValue])
        } else if (value.includes(itemValue)) {
          onChange(value.filter((v) => v !== itemValue && v !== 'none'))
        } else {
          onChange(value.filter((v) => v !== 'none').concat(itemValue))
        }
      } else {
        console.log('onChange', itemValue)
        onChange(itemValue)
      }
    },
    [multiple, value],
  )

  return (
    <Container style={style}>
      {options.map((option) => {
        // console.log('value === option.value', value === option.value, value, option.value )
        return (
          <SelectItem
            key={option.label}
            label={option.label}
            value={option.value || defaultValue || option.value}
            isSelected={multiple ? value && value.includes(option.value) : value === option.value}
            onSelect={(itemValue) => onSelect(itemValue)}
          />
        )
      })}
    </Container>
  )
}
