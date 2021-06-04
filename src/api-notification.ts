import _ from 'lodash'
import { fetch } from 'react-native-ssl-pinning'
import { getAnonymousHeaders } from './api'
import { NOTIFICATION_API_URL, SSL_PINNING_CERT_NAME } from './config'
import { NotificationHistoryModel } from './navigations/3-MainApp/NotificationHistory'

export const getNotifications = async (param: {
  skip?: number
  limit?: number
}) => {
  try {
    const res = await fetch(
      NOTIFICATION_API_URL +
        '/notifications' +
        (param
          ? `?${new URLSearchParams(param as Record<string, string>)}`
          : ''),
      {
        sslPinning: {
          certs: [SSL_PINNING_CERT_NAME],
        },
        headers: getAnonymousHeaders(),
        method: 'GET',
      },
    )
    const json = await res.json()

    if (_.isArray(json)) {
      return json as NotificationHistoryModel[]
    }
  } catch (error) {
    // console.error('Failed', json);
  }

  return []
}

/*
export const patchNotifications = async () => {
  try {
    const res = await fetch(NOTIFICATION_API_URL + '/notifications', {
      sslPinning: {
        certs: [SSL_PINNING_CERT_NAME],
      },
      headers: getAnonymousHeaders(),
      method: 'PATCH',
    })
    const text = await res.text()
    console.log('patchNotifications', text)

  } catch (error) {
    // console.error('Failed', json);
    return 'failed' as const
  }

  return 'ok' as const
}
*/
