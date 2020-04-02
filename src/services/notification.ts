import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import { backgroundTracking } from './background-tracking'
import { updateUserData } from '../api'

class Notification {
  isConfigured = false
  configure() {    
    if (this.isConfigured) {
      return
    }
    console.log('notification configure')
    this.isConfigured = true
    
    return PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(pushToken) {
        console.log('notification TOKEN:', pushToken)
        updateUserData({
          pushToken
        }).then(r => {
          console.log('notification save push token', r)
        })
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        backgroundTracking.getLocation() // trigger update location
        console.log('NOTIFICATION:', notification)
        // process the notification
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        notification.finish(PushNotificationIOS.FetchResult.NoData)
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    })
  }
}

export const pushNotification = new Notification()
