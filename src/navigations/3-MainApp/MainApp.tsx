import React from 'react'
import { MockScreen } from '../MockScreen'
import { CovidQRCode } from '../../components/QRCode'
import { COLORS } from '../../styles'

// const QRCode = 

const covidData: QRData = {
  color: 'green', // green, yellow, orange, red
  gender: 'M', // M | F
  age: 25
}
export const MainApp = () => {
  return (
    <MockScreen title="หยุดเชื้อ เพื่อชาติ" 
      content={<CovidQRCode data={covidData} bgColor={COLORS.PRIMARY_DARK} />}
    />
  )
}