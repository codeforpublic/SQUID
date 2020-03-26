const API_URL = 'https://rlvgpp4loe.execute-api.ap-southeast-1.amazonaws.com/staging'

export const requestOTP = async (phoneNumber: string) => {
  const formatNumber = phoneNumber.replace(/^0/, '+66')
  console.log('formatNumber', formatNumber)
  const resp = await fetch(API_URL + `/otp?number=${formatNumber}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  console.log('request otp', resp.status, await resp.json())
}

export const verifyOTP = async (phoneNumber: string, code: string) => {
  const formatNumber = phoneNumber.replace(/^0/, '+66')

  const resp = await fetch(API_URL + `/otp/verify?number=${formatNumber}&code=${code}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const { result } = await resp.json()
  return result === 'success'
}