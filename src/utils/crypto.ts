import { RSA, RSAKeychain } from 'react-native-rsa-native'

let publicKey

export const refetchDDCPublicKey = async () => {
  /* todo: custom domain and ssl pinning */
  const resp = await fetch('http://164.115.36.87/key-service/public_key')
  if (resp.status === 200) {
    publicKey = await resp.text()
  }
}

export const encryptMessage = (message) => {
  return RSA.encrypt(message, publicKey)
}