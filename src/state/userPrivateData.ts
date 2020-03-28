import SInfo from 'react-native-sensitive-info'
import AsyncStorage from "@react-native-community/async-storage"
import nanoid from "nanoid"
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const USER_DATA_KEY = '@USER_PRIVATE_DATA'

interface UserData {
  id: string
  anonymousId: string
  faceURI?: string
}

const SINFO_OPTIONS = {
  sharedPreferencesName: 'ThaiAlert.UserPrivateData',
  keychainService: '@ThaiAlert/UserPrivateData',
}

class UserPrivateDate {
  data: UserData
  save() {
    return SInfo.setItem(USER_DATA_KEY, JSON.stringify(this.data), SINFO_OPTIONS)
  }
  async load() {
    const userDataString = await SInfo.getItem(USER_DATA_KEY, SINFO_OPTIONS)
    if (userDataString) {
      this.data = JSON.parse(userDataString)
    } else {
      this.data = {
        id: Platform.select({
          android: DeviceInfo.getMacAddressSync(),
          ios: nanoid(),
          default: nanoid()
        }),
        anonymousId: DeviceInfo.getUniqueId()
      }
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
  setData(key: keyof UserData, value: any) {
    this.data[key] = value
    return this.save()
  }
}

export const userPrivateData = new UserPrivateDate()