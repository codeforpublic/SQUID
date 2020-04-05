import { RELATIVE_FACE_PATH } from './../navigations/const'
import RNFS from 'react-native-fs'
import SInfo from 'react-native-sensitive-info'
import { HookState, createUseHookState } from '../utils/hook-state'
import { Platform } from 'react-native'
import { registerDevice } from '../api'

const USER_DATA_KEY = '@USER_PRIVATE_DATA'

type valueof<T> = T[keyof T]
interface UserData {
  id: string
  anonymousId: string
  faceURI?: string
  version?: number
  mobileNumber?: string
}

const SINFO_OPTIONS = {
  sharedPreferencesName: 'ThaiAlert.UserPrivateData',
  keychainService: '@ThaiAlert/UserPrivateData',
}
const LATEST_VERSION = 1

class UserPrivateData extends HookState {
  data: UserData
  constructor() {
    super('UserPrivateData')
    // @ts-ignore
    this.data = {}
  }
  save() {
    super.save()
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
    
    if (!this.data) {
      this.data = {
        anonymousId: '',
        id: '',
      }      
    }
    const register = () => {
      return registerDevice().then(({ userId, anonymousId }) => {
        this.data.id = userId
        this.data.anonymousId = anonymousId
        this.data.version = 1
        return this.save()
      })
    }
    if (this.data.version !== LATEST_VERSION) {
      /* wait to register */
      await register()
    } else {
      /* just sync, if failed, stil fine  */
      register()
    }
  }

  getId = () => {    
    return this.data.id
  }
  getAnonymousId = () => {
    return this.data.anonymousId
  }
  getMobileNumber(): string {
    return this.data?.mobileNumber
  }
  getData = (key: keyof UserData) => {
    return this.data && this.data[key]
  }
  getFace() {
    const dataPath = `${RNFS.DocumentDirectoryPath}/${this.getData('faceURI')}`
    if (Platform.OS === 'android') {
      return 'file://' + dataPath
    }
    return dataPath
  }
  setData(key: keyof UserData, value: valueof<UserData>) {
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
export const useUserPrivateData = createUseHookState<UserData>(userPrivateData)
