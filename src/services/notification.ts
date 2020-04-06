import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { backgroundTracking } from './background-tracking'
import { updateUserData } from '../api'

console.disableYellowBox = true

class Notification {
  isConfigured = false
  mockNotVerified() {
    PushNotification.localNotificationSchedule({
      title: 'กรุณายืนยันตัวตนด้วยเบอร์โทรศัพท์',
      message: 'เพื่อนำผลประเมิน COVID-19 มาปรับปรุงผลการประเมิน',
      date: new Date(Date.now() + 15 * 1000),
    })
  }
  mockOrangeCode() {
    PushNotification.localNotificationSchedule({
      title: 'สถานะของคุณได้ถูกเปลี่ยนเป็นสีส้ม',
      message:
        'เนื่องจากท่านมีประวัติเดินทางจากพื้นที่เสี่ยง ให้กักตัว 14 วัน พร้อมเฝ้าระวังอาการ ถ้ามีอาการไข้ ร่วมกับ อาการระบบทางเดินหายใจ ให้ติดต่อสถานพยาบาลทันที',
      date: new Date(Date.now() + 10 * 1000),
    })
  }
  mockRedCode() {
    PushNotification.localNotificationSchedule({
      title: 'สถานะของคุณได้ถูกเปลี่ยนเป็นสีแดง',
      message: 'คุณเข้าสู่สภาวะเสี่ยงสูง สถานพยาบาลกำลังจะติดต่อคุณกลับไปทันที',
      date: new Date(Date.now() + 10 * 1000),
    })
  }
  dailyAdvice() {
    PushNotification.localNotificationSchedule({
      title: 'คำแนะนำของคุณในวันนี้ (สีส้ม)',
      message:
        'เนื่องจากท่านมีประวัติเดินทางจากพื้นที่เสี่ยง ให้กักตัว 14 วัน พร้อมเฝ้าระวังอาการ ถ้ามีอาการไข้ ร่วมกับ อาการระบบทางเดินหายใจ ให้ติดต่อสถานพยาบาลทันที',
      date: new Date(Date.now() + 10 * 1000),
    })
  }
  configure() {
    if (this.isConfigured) {
      return
    }
    console.log('notification configure')
    this.isConfigured = true

    PushNotificationIOS.addEventListener('registrationError', (data) => {
      console.log('_____PushNotificationIOS::registrationError', { ...data })
    })

    return PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: (pushToken) => {
        console.log('notification TOKEN:', pushToken)
        updateUserData({
          pushToken,
        }).then((r) => {
          console.log('notification save push token', r)
        })
      },
      onError: (data) => {
        console.warn('_____PushNotificationIOS::registrationError', { ...data })
      },
      senderID: "914417222955",

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
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
