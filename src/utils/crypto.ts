import { RSA } from 'react-native-rsa-native'
import { PUBLIC_KEY_URL, PUBLIC_KEY_PINNING_CERT } from '../config'
import { fetch } from 'react-native-ssl-pinning'

let publicKey
export const refetchDDCPublicKey = async () => {
  try {
    const resp = await fetch(PUBLIC_KEY_URL, {
      method: 'GET',
      sslPinning: {
        certs: [PUBLIC_KEY_PINNING_CERT],
      },
    })
    if (resp.status === 200) {
      publicKey = await resp.text()
    }
  } catch {}
}

export const encryptMessage = message => {
  return RSA.encrypt(message, publicKey)
}