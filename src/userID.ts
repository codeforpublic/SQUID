import AsyncStorage from "@react-native-community/async-storage"
import nanoid from "nanoid"

const USER_ID_KEY = '@USER_ID'
class UserID {
  id: string
  save(id: string) {
    return AsyncStorage.setItem(USER_ID_KEY, id)
  }
  async load() {
    this.id = await AsyncStorage.getItem(USER_ID_KEY)
    if (!this.id) {
      this.id = nanoid()
      await this.save(this.id)
    }
    return this.id
  }
  get() {
    if (!this.id) {
      throw new Error('User\'ven\'t loaded yet')
    }
    return this.id
  }
}

export const userID = new UserID()