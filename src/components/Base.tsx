import React from 'react'
import { StyleSheet, Text, View } from "react-native";
import { FONT_FAMILY, COLORS } from '../styles';
import styled from '@emotion/native'

export const Header = styled(View)({
  // flexDirection: 'row',
  alignItems: 'center',
})

export const Title = styled(Text)({
  fontFamily: FONT_FAMILY,
  fontStyle: 'normal',
  fontSize: 28,
  lineHeight: 50,
  alignItems: 'center',
  color: COLORS.PRIMARY_DARK,
  textAlign: 'center',
  width: '100%'
})

export const Subtitle = styled(Text)({
  fontFamily: FONT_FAMILY,
  fontWeight: 'bold',
  fontSize: 16,
  lineHeight: 30,
  alignItems: 'center',
  color: COLORS.GRAY_2,
  textAlign: 'center'
})

export const Link = styled(Text)({
  fontFamily: FONT_FAMILY,
  fontWeight: 'bold',
  fontSize: 16,
  lineHeight: 30,
  alignItems: 'center',
  color: COLORS.BLUE,
  textAlign: 'center'
})