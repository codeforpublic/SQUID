import { userPrivateData } from './state/userPrivateData'

export const API_URL = 'https://api.staging.thaialert.com'
const API_KEY = 'd6857fca1cfbeb600b399ac29f2dabf9'

export const getPrivateHeaders = () => {
  return {
    'X-TH-API-Key': API_KEY,
    'X-TH-USER-ID': userPrivateData.getId(),
    'X-TH-ANONYMOUS-ID': userPrivateData.getAnonymousId(),
    'Content-Type': 'application/json',
  }
}

export const getAnonymousHeaders = () => {
  return {
    'X-TH-API-Key': API_KEY,
    'X-TH-ANONYMOUS-ID': userPrivateData.getAnonymousId(),
    'Content-Type': 'application/json',
  }
}

export const requestOTP = async (mobileNo: string) => {
  const resp = await fetch(API_URL + `/requestOTP`, {
    method: 'post',
    headers: getPrivateHeaders(),
    body: JSON.stringify({ mobileNo }),
  })
  const result = await resp.json()

  return result.status === 'ok'
}

export const verifyOTP = async (otpCode: string) => {
  const resp = await fetch(API_URL + `/mobileParing`, {
    method: 'post',
    headers: getPrivateHeaders(),
    body: JSON.stringify({ otpCode }),
  })
  const result = await resp.json()

  return result.status === 'ok'
}

export const updateUserData = async (data: { [key: string]: any }) => {
  const resp = await fetch(API_URL + `/userdata`, {
    method: 'post',
    headers: getAnonymousHeaders(),
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
    headers: getPrivateHeaders(),
  })
  const result: QRData = await resp.json()
  
  return result
}