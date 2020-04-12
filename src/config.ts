import Config from 'react-native-config'
import { Platform } from 'react-native'
/*
  define config in .env and .env.production
*/

export const API_URL = Config.API_URL
export const API_KEY = Config.API_KEY
export const CODEPUSH_DEPLOYMENT_KEY = Platform.select({
  ios: Config.CODE_PUSH_IOS,
  android: Config.CODE_PUSH_ANDROID,
})

setTimeout(() => {
  console.log('Config', Config)
}, 1000)