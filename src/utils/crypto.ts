import { RSA } from 'react-native-rsa-native'
import { API_URL, API_KEY, SSL_PINNING_CERT_NAME } from '../config'
import { fetch } from 'react-native-ssl-pinning'

let publicKey
export const refetchDDCPublicKey = async () => {
  try {
    const resp = await fetch(API_URL + '/ddc/public_key', {
      method: 'GET',
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: {
      'X-TH-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    })
    if (resp.status === 200) {
      publicKey = await resp.text()
    }
  } catch (err) {
    console.log('fetch publicKey error', err)
  }
}

export const encryptMessage = message => {
  if (!publicKey) {
    throw new Error('Public key not found')
  }
  return RSA.encrypt(message, publicKey)
}