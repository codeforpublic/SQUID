import RNPickerSelect from 'react-native-picker-select'
import AsyncStorage from '@react-native-community/async-storage'
import RNRestart from 'react-native-restart'

export const changeLangTo = async lang => {
  await AsyncStorage.setItem('locale', lang)
  RNRestart.Restart()
}
