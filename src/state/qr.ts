import { getQRData } from '../api'
import { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import 'moment/locale/th'
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

let _qrData: SelfQR | null
export const useSelfQR = () => {
  const [qrData, setQRData] = useState(_qrData)
  useEffect(() => {
    const updateQR = () => {
      getQRData().then(d => {
        _qrData = new SelfQR(d)
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
  code: string
  constructor(code) {
    this.code = code
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
}

class SelfQR extends QR {
  qrData: QRData
  code: string
  constructor(qrData: QRData) {
    super(qrData.data.code)
    this.qrData = qrData
  }
  getAnonymousId() {
    return this.qrData.data.anonymousId
  }
  getQRImageURL() {
    return `data:${this.qrData.qr.type};base64,` + this.qrData.qr.base64
  }
}

interface DecodedResult {
  _: [string, 'G' | 'Y' | 'O' | 'R']
  iat: number
  iss: string
}
export class QRResult extends QR {
  iat: number
  code: string
  annonymousId: string
  iss: string
  constructor(decodedResult: DecodedResult) {
    super(CODE_MAP[decodedResult._[1]])
    this.annonymousId = decodedResult._[0]
    this.iat = decodedResult.iat
    this.iss = decodedResult.iss
  }
  getCreatedDate() {
    return moment(this.iat * 1000).locale('th')
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
const CODE_MAP = {
  'G': 'green',
  'Y': 'yellow',
  'O': 'orange',
  'R': 'red'
}