import AsyncStorage from "@react-native-community/async-storage"

const ApplicationStateKey = '@applicationState'

interface ApplicationStateData {
  isPassedOnboarding?: boolean
  isRegistered?: boolean
}
class ApplicationState {
  data: ApplicationStateData
  async load() {
    const appStateString = await AsyncStorage.getItem(ApplicationStateKey)
    if (appStateString) {
      const appState = JSON.parse(appStateString)
      this.data = {
        isPassedOnboarding: appState.isPassedOnboarding,
        isRegistered: appState.isRegistered,
      }
    } else {
      this.data = {
        isPassedOnboarding: false,
        isRegistered: false
      }
    }
  }
  save() {
    return AsyncStorage.setItem(ApplicationStateKey, JSON.stringify(this.data))
  }
  set(key: keyof ApplicationStateData, value) {
    this.data[key] = value
    return this.save()
  }
  get(key: keyof ApplicationStateData) {
    return this.data[key]
  }
}

export const applicationState = new ApplicationState()