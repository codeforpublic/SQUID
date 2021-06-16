import Config from 'react-native-config'
import { Platform } from 'react-native'
/*
  define config in .env and .env.production
*/

export const API_URL = Config.API_URL
export const SSL_PINNING_CERT_NAME = Config.SSL_PINNING_CERT_NAME
export const CODEPUSH_DEPLOYMENT_KEY = Platform.select({
  ios: Config.CODE_PUSH_IOS,
  android: Config.CODE_PUSH_ANDROID,
})
export const PUBLIC_KEY_URL = Config.PUBLIC_KEY_URL
export const PUBLIC_KEY_PINNING_CERT = Config.PUBLIC_KEY_PINNING_CERT
export const SHOP_API_NAME = Config.SHOP_API_NAME
export const SHOP_API_KEY = Config.SHOP_API_KEY
export const SHOP_API_URL = Config.SHOP_API_URL
export const SHOP_QR_PINNING_CERT = Config.SHOP_QR_PINNING_CERT

// Notification api config
export const NOTIFICATION_API_URL = Config.NOTIFICATION_API_URL
