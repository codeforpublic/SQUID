import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FONT_FAMILY, COLORS, FONT_BOLD, FONT_SIZES } from '../styles'
import styled from '@emotion/native'

export const Header = styled(View)({
  // flexDirection: 'row',
  alignItems: 'center',
})

export const Title = styled(Text)({
  fontFamily: FONT_BOLD,
  fontSize: FONT_SIZES[800],
  lineHeight: 36,
  alignItems: 'center',
  color: COLORS.PRIMARY_DARK,
  textAlign: 'center',
  width: '100%',
})

export const Subtitle = styled(Text)({
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZES[600],
  alignItems: 'center',
  color: COLORS.GRAY_2,
  textAlign: 'center',
})

export const Link = styled(Text)({
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZES[600],
  lineHeight: 30,
  alignItems: 'center',
  color: COLORS.BLUE,
  textAlign: 'center',
})

export const WhiteText = styled(Text)({
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZES[500],
  lineHeight: 30,
  color: COLORS.WHITE,
})

export const ColorText = styled(Text)`
  font-family: ${FONT_FAMILY};
  font-size: ${FONT_SIZES[600]};
  line-height: 30px;
  color: ${props => props.color};
`
