import { RSA } from 'react-native-rsa-native'

let publicKey

export const refetchDDCPublicKey = async () => {
  /* todo: custom domain and ssl pinning */
  try {
    const resp = await fetch('http://164.115.36.87/key-service/public_key')
    if (resp.status === 200) {
      publicKey = await resp.text()
    }
  } catch {}
}

export const encryptMessage = (message) => {
  return RSA.encrypt(message, publicKey)
}