import JwtUtils from 'react-native-jwt-verifier'
import jwtDecode from 'jwt-decode'
import { fetchJWKs } from '../api'

import I18n from '../../i18n/i18n'

let jwks
export const refetchJWKs = async () => {
  const result = await fetchJWKs()
  if (result) {
    jwks = result
  }
}

export const verifyToken = (token) => {
  return JwtUtils.verify(token, jwks.x, jwks.y)
}

export const decodeJWT = (token) => {
  try {
    return jwtDecode(token)
  } catch (e) {
    console.log(e)
    return { error: I18n.t('incorrect_qr') }
  }
}
