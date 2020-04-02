import { RELATIVE_FACE_PATH } from './../navigations/const'
import RNFS from 'react-native-fs'
import SInfo from 'react-native-sensitive-info'
import AsyncStorage from '@react-native-community/async-storage'
import nanoid from 'nanoid'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'
import { registerDevice } from '../api'

const USER_DATA_KEY = '@USER_PRIVATE_DATA'

interface UserData {
  id: string
  anonymousId: string
  faceURI?: string
  version?: number
}

const SINFO_OPTIONS = {
  sharedPreferencesName: 'ThaiAlert.UserPrivateData',
  keychainService: '@ThaiAlert/UserPrivateData',
}
const LATEST_VERSION = 1

class UserPrivateData {
  data: UserData
  save() {
    return SInfo.setItem(
      USER_DATA_KEY,
      JSON.stringify(this.data),
      SINFO_OPTIONS,
    )
  }
  async load() {
    const userDataString = await SInfo.getItem(USER_DATA_KEY, SINFO_OPTIONS)
    if (userDataString) {
      this.data = JSON.parse(userDataString)
    }
    if (!this.data || this.data.version !== LATEST_VERSION) {
      this.data = {
        anonymousId: '',
        id: '',
      }
      const { userId, anonymousId } = await registerDevice()
      this.data.id = userId
      this.data.anonymousId = anonymousId
      this.data.version = 1
      await this.save()
    }
  }

  getId() {    
    return this.data.id
  }
  getAnonymousId() {    
    return this.data.anonymousId
  }
  getData(key: keyof UserData) {
    return this.data[key]
  }
  getFace() {
    const dataPath = `${RNFS.DocumentDirectoryPath}/${this.getData('faceURI')}`
    if (Platform.OS === 'android') {
      return 'file://' + dataPath
    }
    return dataPath
  }
  setData(key: keyof UserData, value: any) {
    this.data[key.toString()] = value
    return this.save()
  }
  setFace(uri, { isTempUri }) {
    if (isTempUri) {
      const newFilePath = `${Date.now()}-${RELATIVE_FACE_PATH}`
      let dataPath = `${RNFS.DocumentDirectoryPath}/${newFilePath}`
      dataPath = Platform.OS === 'android' ? `file://${dataPath}` : dataPath
      RNFS.copyFile(uri, dataPath)
      return this.setData('faceURI', newFilePath)
    }
    return this.setData('faceURI', uri)
  }
}

export const userPrivateData = new UserPrivateData()
