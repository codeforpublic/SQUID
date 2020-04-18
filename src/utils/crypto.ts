import { RSA } from 'react-native-rsa-native'

const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz22rqUlKldULTJ6vlL7h\nSSpVw0FeSYhM6rgLMh41t0DzYNNWm3EOMsAvBanfvedI4aY9lCCbyS2HTVgOy5W7\n6OZzXEc0tRDiHfVhccqypH49pvGbc4aIWjmj4KHEprtZpVPVMie8v6g7Fm3Jtjoh\niFAngJ9i9vWM1oW5jQiL9R+v+6aI52YF6dsdXSolF+zZjXNZuRhFPPfPgNMn6Ar3\n9FaB8/gWOQdScfU695CUbn74NrB+8tfH3Gyrc0/QyPJWpAPN8PSfns9W4eOKSiqK\n9zubWFKbAswTVshpJUjbQPvqQpSa0BFjdJo/6bFrXmIvqobdAlCJ82t7gk1NItsm\ntQIDAQAB\n-----END PUBLIC KEY-----'
export const hashMessage = (message) => {
  return RSA.encrypt(message, PUBLIC_KEY)
}