import React, { useState, useEffect, useMemo } from 'react'
import QRCode from 'react-qr-code';
import { encodeJWT, decodeJWT } from '../utils/jwt'

const COLORS = {
  green: '#297D13',
  yellow: '#D3C226',
  orange: '#E18518',
  red: '#D22525',
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