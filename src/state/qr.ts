import { getQRData } from '../api'
import { useEffect, useState } from 'react'

interface QRData {
  data: {
    anonymousId: string
    code: string
  }
  qr: {
    type: string
    base64: string
  }
}

let _qrData: QRData | null
export const useQRData = () => {
  const [qrData, setQRData] = useState(_qrData)
  useEffect(() => {
    const updateQR = () => {
      getQRData().then(d => {
        _qrData = d
        setQRData(d)
      })
    }
    updateQR()
    const it = setInterval(updateQR, 2 * 60 * 1000)
    return () => {
      clearInterval(it)
    }
  }, [])

  return qrData
}
