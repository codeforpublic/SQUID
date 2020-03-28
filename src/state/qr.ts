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

let _qrData: QR | null
export const useQRData = () => {
  const [qrData, setQRData] = useState(_qrData)
  useEffect(() => {
    const updateQR = () => {
      getQRData().then(d => {
        _qrData = new QR(d)
        setQRData(_qrData)
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

class QR {
  qrData: QRData
  code: string
  constructor(qrData) {
    this.qrData = qrData
    this.code = this.qrData.data.code
  }
  getStatusColor() {
    return STATUS_COLORS[this.code]
  }
  getLevel() {
    return LEVELS[this.code]
  }
  getScore() {
    return SCORES[this.code]
  }
  getLabel() {
    return LABELS[this.code]
  }
  getQRImageURL() {
    return `data:${this.qrData.qr.type};base64,` + this.qrData.qr.base64
  }
}

const STATUS_COLORS = {
  green: '#27C269',
  yellow: '#E5DB5C',
  orange: '#E18518',
  red: '#EC3131',
  DEFAULT: '#B4B5C1',
}
const LEVELS = {
  green: 1,
  yellow: 2,
  orange: 3,
  red: 4,
}
const SCORES = {
  green: 100,
  yellow: 80,
  orange: 50,
  red: 30,
}
const LABELS = {
  green: 'ความเสี่ยงต่ำ',
  orange: 'ความเสี่ยงปานกลาง',
  yellow: 'ความเสี่ยงสูง',
  red: 'ความเสี่ยงสูงมาก',
}