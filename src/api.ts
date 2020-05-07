import DeviceInfo from 'react-native-device-info'
import { userPrivateData } from './state/userPrivateData'
import nanoid from 'nanoid'
import { API_URL, SSL_PINNING_CERT_NAME } from './config'
import { encryptMessage, refetchDDCPublicKey } from './utils/crypto'
import { fetch } from 'react-native-ssl-pinning'

export const getAnonymousHeaders = () => {
  const authToken = userPrivateData.getData('authToken')
  return {
    Authorization: authToken ? 'Bearer ' + authToken : void 0,
    'X-TH-ANONYMOUS-ID': userPrivateData.getAnonymousId(),
    'Content-Type': 'application/json',
  }
}

export const fetchJWKs = async () => {
  const resp = await fetch(API_URL + `/.well-known/jwks.json`, {
    method: 'GET',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (resp.status === 200) {
    return resp.json()
  }
}

export const registerDevice = async (): Promise<{
  userId: string
  anonymousId: string
}> => {
  const resp = await fetch(API_URL + `/registerDevice`, {
    method: 'POST',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deviceId: DeviceInfo.getUniqueId() }),
  })
  const result = await resp.json()
  if (!result.anonymousId || !result.userId) {
    throw new Error('RegisterDevice failed')
  }

  return { userId: result.userId, anonymousId: result.anonymousId }
}

export const requestOTP = async (mobileNo: string) => {
  const resp = await fetch(API_URL + `/requestOTP`, {
    method: 'POST',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: getAnonymousHeaders(),
    body: JSON.stringify({
      mobileNo /* use to send sms only, store only hashed phone number in server */,
    }),
  })
  const result = await resp.json()

  return result.status === 'ok'
}

/*
  verify otp and save encryptedMobileNo
*/
export const mobileParing = async (mobileNo: string, otpCode: string) => {
  await refetchDDCPublicKey()
  const encryptedMobileNo = await encryptMessage(mobileNo)
  const resp = await fetch(API_URL + `/mobileParing`, {
    method: 'POST',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: getAnonymousHeaders(),
    body: JSON.stringify({ otpCode, encryptedMobileNo }),
  })
  const result = await resp.json()
  if (result.status === 'ok') {
    userPrivateData.setData('authToken', result.token)
    return true
  }
  return false
}

export const updateUserData = async (data: { [key: string]: any }) => {
  const resp = await fetch(API_URL + `/userdata`, {
    method: 'POST',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
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
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: getAnonymousHeaders(),
  })
  const result = await resp.json()

  return result
}

export const getTagData = async () => {
  const resp = await fetch(API_URL + `/tags`, {
    method: 'GET',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: getAnonymousHeaders(),
  })
  if (resp.status !== 200) {
    throw new Error('Invalid')
  }
  const result = await resp.json()

  return result as any
}

export const scan = async (
  anonymousList: string[],
  location: { latitude: number; longitude: number; accuracy: number },
  type: 'bluetooth' | 'qrscan',
) => {
  return fetch(API_URL + '/scan', {
    method: 'POST',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: getAnonymousHeaders(),
    body: JSON.stringify({
      meetId: nanoid(),
      timestamp: new Date().toISOString(),
      meetWithIds: anonymousList,
      location,
      type,
    }),
  })
}
