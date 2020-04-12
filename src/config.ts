import Config from 'react-native-config'
/*
  define config in .env and .env.production
*/

export const API_URL = Config.API_URL
export const API_KEY = Config.API_KEY

setTimeout(() => {
  console.log('Config', Config)
}, 1000)