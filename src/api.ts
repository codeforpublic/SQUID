import { userID } from './userID'

const API_URL = 'https://api.staging.thaialert.com'

export const getHeaders = () => {
  return {
    'X-TH-USER-ID': userID.get(),
    'Content-Type': 'application/json',
  }
}

export const requestOTP = async (mobileNo: string) => {
  const resp = await fetch(API_URL + `/requestOTP`, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify({ mobileNo })
  })
  return (await resp.json()).status === 'ok'
}

export const verifyOTP = async (otpCode: string) => {
   const resp = await fetch(API_URL + `/otp/mobileParing`, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify({ otpCode })
  })

  return (await resp.json()).status === 'ok'
}

export const updateUserData = async (data: { [key: string]: any }) => {
  const resp = await fetch(API_URL + `/userdata`, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify({ data })
  })
  return resp.json()
}