import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { backgroundTracking } from './background-tracking'
import { updateUserData } from '../api'
import { applicationState } from '../state/app-state'
import { AppState } from 'react-native'

import I18n from '../../i18n/i18n';

console.disableYellowBox = true

export enum NOTIFICATION_TYPES {
  OPEN = 'OPEN',
}

const payload = {
  message: 'แบบสอบถามสำหรับคุณ',
  data: {
    type: 'OPEN',
    url:
      'https://app.morchana.in.th/q/q1?x=1&token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbm9ueW1vdXNJZCI6Il9MdW1HNlBjRzMxNCIsImlhdCI6MTU4OTAxMjEwOSwiZXhwIjoxNTg5MDk4NTA5fQ.HbGjD1oS8Y0b5GAgyBNh3Zk-D0nI2MLBdjOgPkkRyjsck2xT6OBO2pOArann9w34m0ho32w3dT45JJNNvhKMyw',
  },
}

class Notification {
  isConfigured = false
  mockNotVerified() {
    PushNotification.localNotificationSchedule({
      title: I18n.t('pls_self_iden_with_phone_no'),
      message: I18n.t('to_help_refining_risk_assessment_result'),
      date: new Date(Date.now() + 15 * 1000),
    })
  }
  mockOrangeCode() {
    PushNotification.localNotificationSchedule({
      title: I18n.t('you_are_orange_now_title'),
      message:
      I18n.t('went_to_risky_zone_quar_14d_observe_if_fever_respiratory_go_see_doc'),
      date: new Date(Date.now() + 10 * 1000),
    })
  }
  mockRedCode() {
    PushNotification.localNotificationSchedule({
      title: I18n.t('you_are_red_now_title'),
      message: I18n.t('you_are_red_now_msg'),
      date: new Date(Date.now() + 10 * 1000),
    })
  }
  dailyAdvice() {
    PushNotification.localNotificationSchedule({
      title: I18n.t('orange_suggestion'),
      message:
      I18n.t('went_to_risky_zone_quar_14d_observe_if_fever_respiratory_go_see_doc'),
      date: new Date(Date.now() + 10 * 1000),
    })
  }
  requestPermissions() {
    PushNotification.requestPermissions()
    applicationState.setData('isAllowNotification', true)
  }
  popInitialNotification(calback) {
    PushNotification.popInitialNotification(calback)
  }
  testNoti() {
    return PushNotification.localNotificationSchedule({
      message: payload.message,
      userInfo: payload,
      date: new Date(Date.now() + 1000), // in 60 secs
    })
  }
  configure(onNotification) {
    const requestPermissions = applicationState.getData(
      'isAllowNotification',
    ) as boolean
    // let appState
    // AppState.addEventListener('change', (state) => {
    //   if (appState !== state) {
    //     if (state === 'active') {
    //       console.log('PushNotification.popInitialNotification')
    //       PushNotification.popInitialNotification(notification => {
    //         console.log('popInitialNotification', notification)
    //       })
    //     }
    //   }
    //   appState = state
    // })

    return PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: pushToken => {
        console.log('notification TOKEN:', pushToken)
        updateUserData({
          pushToken,
        }).then(r => {
          console.log('notification save push token', r)
        })
      },
      senderID: '914417222955',

      // (required) Called when a remote or local notification is opened or received
      onNotification: async function(notification) {
        console.log('onNotification')
        backgroundTracking.getLocation() // trigger update location
        await onNotification(notification)
        // notification?.data?.
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
      requestPermissions,
    })
  }
}

export const pushNotification = new Notification()
