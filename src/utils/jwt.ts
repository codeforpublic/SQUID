import jwtDecode from 'jwt-decode'
import jwtPure from 'react-native-pure-jwt'

export const decodeJWT = token => {
  try {
    return jwtDecode(token)
  } catch (e) {
    console.log(e)
    return { error: 'QR Code ไม่ถูกต้อง' }
  }
}

export const encodeJWT = data => {
  return jwtPure.sign({ ...data, iat: Date.now() }, 'fight-covid-19', {
    alg: 'HS256',
  })
}
