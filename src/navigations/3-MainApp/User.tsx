import AsyncStorage from '@react-native-community/async-storage'
import 'react-native-get-random-values'

var _userId = ''

export async function getUserId() {
  if (_userId != '') return _userId
  try {
    const value = await AsyncStorage.getItem('userId')
    if (value) {
      _userId = value
      return _userId
    }
  } catch (error) {
    // Error retrieving data
  }
  _userId = 'NOID'
  return _userId
}

async function saveUserId(userId) {
  try {
    await AsyncStorage.setItem('userId', userId)
  } catch (error) {
    // Error saving data
  }
}
