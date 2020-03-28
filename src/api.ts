import { userPrivateData } from './state/userPrivateData'

export const API_URL = 'http://localhost:4210'

export const getHeaders = () => {
  return {
    'X-TH-API-Key': 'd6857fca1cfbeb600b399ac29f2dabf9',
    'X-TH-USER-ID': userPrivateData.getId(),
    'Content-Type': 'application/json',
  }
}

export const requestOTP = async (mobileNo: string) => {
  const resp = await fetch(API_URL + `/requestOTP`, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify({ mobileNo }),
  })
  const result = await resp.json()
  console.log('requestOTP:' + JSON.stringify(result), result.status === 'ok')

  return result.status === 'ok'
}

export const verifyOTP = async (otpCode: string) => {
  const resp = await fetch(API_URL + `/mobileParing`, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify({ otpCode }),
  })
  const result = await resp.json()
  console.log('verifyOTP:' + JSON.stringify(result), result.status === 'ok')

  return result.status === 'ok'
}

export const updateUserData = async (data: { [key: string]: any }) => {
  const resp = await fetch(API_URL + `/userdata`, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify({ data }),
  })
  return resp.json()
}

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

export const getQRData = async () => {
  const resp = await fetch(API_URL + `/qr`, {
    method: 'post',
    body: JSON.stringify({
      anonymousId: userPrivateData.getId()
    }),
    headers: getHeaders(),
  })
  const result: QRData = await resp.json()
  
  return result
}