import React from 'react'
import { MockScreen } from '../MockScreen'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'

export const QRCodeResult = () => {
  const data: QRData = useNavigationParam('data')
  const { color, age, gender  } = data
  alert(color)
  return (
    <MockScreen title="QR Result" />
  )
}