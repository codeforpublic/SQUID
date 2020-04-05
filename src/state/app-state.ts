import AsyncStorage from "@react-native-community/async-storage"
import { HookState, createUseHookState } from "../utils/hook-state"

const ApplicationStateKey = '@applicationState'
type valueof<T> = T[keyof T]
interface ApplicationStateData {
  isPassedOnboarding?: boolean
  isRegistered?: boolean
  isVerified?: boolean
  skipRegistration?: boolean
  filledQuestionaire?: boolean
  createdDate?: string
  updateProfileDate?: string
}
class ApplicationState extends HookState {
  data: ApplicationStateData
  constructor() {
    super('ApplicationState')
    this.data = {}
  }
  async load() {
    const appStateString = await AsyncStorage.getItem(ApplicationStateKey)
    if (appStateString) {
      const appState = JSON.parse(appStateString)
      this.data = appState
    } else {
      this.data = {
        isPassedOnboarding: false,
        isRegistered: false,
        skipRegistration: false
      }
    }
    if (!this.data.createdDate) {
      this.data.createdDate = new Date().toISOString()
      await this.save()
    }
  }
  save() {
    super.save()
    return AsyncStorage.setItem(ApplicationStateKey, JSON.stringify(this.data))
  }
  setData = (key: keyof ApplicationStateData, value: valueof<ApplicationStateData>) => {
    this.data[key] = value
    return this.save()
  }
  getData = (key: keyof ApplicationStateData) => {
    return this.data && this.data[key]
  }
}

export const applicationState = new ApplicationState()
export const useApplicationState = createUseHookState<ApplicationStateData>(applicationState)