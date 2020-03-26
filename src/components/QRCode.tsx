import React, { useState, useEffect, useMemo } from 'react'
import QRCode from 'react-qr-code';
import { encodeJWT, decodeJWT } from '../utils/jwt'

const COLORS = {
  green: '#56AF3E',
  yellow: '#F3DF27',
  orange: '#FF981E',
  red: '#F85151',
  DEFAULT: '#B4B5C1',
}

/*
  issues: slow render qrcode
*/
export const CovidQRCode = ({ data, bgColor }: { data: QRData, bgColor?: string }) => {
  const [encoded, setEncoded] = useState(null)
  useEffect(() => {
    encodeJWT(data).then(encoded => {
      setEncoded(encoded)
      // console.log('decodeJWT', decodeJWT(encoded))
    })
  }, [])
  if (!encoded) {
    return null
  }
  return <QRCode value={encoded} fgColor={COLORS[data.color]} bgColor={bgColor} />
}