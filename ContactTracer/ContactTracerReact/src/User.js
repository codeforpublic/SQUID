import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-get-random-values';
import {nanoid} from './nanoid';

var _userId = '';

export async function getUserId() {
  if (_userId != '') return _userId;
  try {
    const value = await AsyncStorage.getItem('userId');
    if (value) {
      _userId = value;
      return _userId;
    }
  } catch (error) {
    // Error retrieving data
  }
  _userId = nanoid().substring(0, 20);
  await saveUserId(_userId);
  return _userId;
}

async function saveUserId(userId) {
  try {
    await AsyncStorage.setItem('userId', userId);
  } catch (error) {
    // Error saving data
  }
}
