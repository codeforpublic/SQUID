import AsyncStorage from "@react-native-community/async-storage"
import nanoid from "nanoid"

const USER_DATA_KEY = '@USER_PRIVATE_DATA'

interface UserData {
  id: string
  faceURI?: string
}

class UserPrivateDate {
  data: UserData
  save() {
    return AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(this.data))
  }
  async load() {
    const userDataString = await AsyncStorage.getItem(USER_DATA_KEY)
    if (userDataString) {
      this.data = JSON.parse(userDataString)
    } else {
      this.data = {
        id: nanoid()
      }
      await this.save()
    }
  }
  getId() {
    return this.data.id
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