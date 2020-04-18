import { RSA } from 'react-native-rsa-native'

let publicKey

export const refetchPublicKey = async () => {
  /* todo: custom domain and ssl pinning */
  const resp = await fetch('http://164.115.36.87/key-service/public_key')
  if (resp.status === 200) {
    publicKey = await resp.text()
  }
}

export const hashMessage = (message) => {
  return RSA.encrypt(message, publicKey)
}