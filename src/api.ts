import { userPrivateData } from './state/userPrivateData'
import nanoid from 'nanoid'
import { API_URL, API_KEY } from 'react-native-dotenv'

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
    method: 'get',
    headers: getAnonymousHeaders(),
  })
  const result: QRData = await resp.json()

  return result
}

export const scan = async (
  anonymousList: string[],
  location: { latitude: number; longitude: number; accuracy: number },
) => {
  return fetch(API_URL + '/scan', {
    method: 'post',
    headers: getAnonymousHeaders(),
    body: JSON.stringify({
      meetId: nanoid(),
      timestamp: new Date().toISOString(),
      meetWithIds: anonymousList,
      location,
    }),
  })
}
