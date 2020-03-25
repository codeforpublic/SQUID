import AsyncStorage from "@react-native-community/async-storage";

const generate = (len = 8) => {
  const dicts = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let word = ''
  for (let i = 0; i < len; i++) {
    word += dicts[Math.floor(Math.random() * dicts.length)]
  }
  return word
}

let trackingId: string

export const getTrackingId = () => {
  return trackingId
}
export const generateTrackingId = () => {
  trackingId = generate()
  return AsyncStorage.setItem('trackingId', trackingId).then(() => {
    return trackingId
  })
}
export const loadTrackingId = () => {
  return AsyncStorage.getItem('trackingId').then(t => {
    if (t) {
      trackingId = t
    }
    return trackingId
  })
}