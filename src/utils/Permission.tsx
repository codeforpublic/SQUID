import { Platform } from 'react-native'

var PermissionsAndroid
if (Platform.OS == 'android') {
  PermissionsAndroid = require('react-native').PermissionsAndroid
}

export async function requestLocationPermission() {
  if (Platform.OS != 'android') {
    return true
  }
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Location Permission',
      message: 'Location permission is needed to ' + 'enable bluetooth.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    })
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location')
    } else {
      console.log('Location permission denied')
    }
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (err) {
    console.warn(err)
  }
  return false
}
