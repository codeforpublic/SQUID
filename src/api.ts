import DeviceInfo from 'react-native-device-info'
import { userPrivateData } from './state/userPrivateData'
import nanoid from 'nanoid'
import { API_URL, API_KEY } from './config'
import { fetch } from 'react-native-ssl-pinning'

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

export const registerDevice = async (): Promise<{
  userId: string
  anonymousId: string
}> => {
  const resp = await fetch(API_URL + `/registerDevice`, {
    method: 'POST',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: {
      'X-TH-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deviceId: DeviceInfo.getUniqueId() }),
  })
  const result = await resp.json()
  console.log('registerDevice', result)
  if (!result.anonymousId || !result.userId) {
    throw new Error('RegisterDevice failed')
  }

  return { userId: result.userId, anonymousId: result.anonymousId }
}

export const requestOTP = async (mobileNo: string) => {
  const resp = await fetch(API_URL + `/requestOTP`, {
    method: 'POST',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: getPrivateHeaders(),
    body: JSON.stringify({ mobileNo }),
  })
  const result = await resp.json()

  return result.status === 'ok'
}

export const verifyOTP = async (otpCode: string) => {
  const resp = await fetch(API_URL + `/mobileParing`, {
    method: 'POST',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: getPrivateHeaders(),
    body: JSON.stringify({ otpCode }),
  })
  const result = await resp.json()
  return result.status === 'ok'
}

export const updateUserData = async (data: { [key: string]: any }) => {
  const resp = await fetch(API_URL + `/userdata`, {
    method: 'POST',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: getAnonymousHeaders(),
    body: JSON.stringify({ data }),
  })
  return resp.json()
}

export const getQRData = async () => {
  const resp = await fetch(API_URL + `/qr`, {
    method: 'GET',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: getAnonymousHeaders(),
  })
  const result = await resp.json()

  return result
}

export const getProficientData = async () => {
  const resp = await fetch(API_URL + `/qr/proficient`, {
    method: 'GET',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: getAnonymousHeaders(),
  })
  if (resp.status !== 200) {
    throw new Error('Invalid')
  }
  const result = await resp.json()

  return result
}

export const scan = async (
  anonymousList: string[],
  location: { latitude: number; longitude: number; accuracy: number },
  type: 'bluetooth' | 'qrscan'
) => {
  return fetch(API_URL + '/scan', {
    method: 'POST',
    sslPinning: {
      certs: ['thaialert']
    },
    headers: getAnonymousHeaders(),
    body: JSON.stringify({
      meetId: nanoid(),
      timestamp: new Date().toISOString(),
      meetWithIds: anonymousList,
      location,
      type
    }),
  })
}
