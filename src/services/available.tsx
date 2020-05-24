import React, { useState, useEffect } from 'react'
import { Alert, AppState } from 'react-native'
import { backgroundTracking } from './background-tracking'

import I18n from '../../i18n/i18n';

export const isServiceAvailable = async () => {
  const t = Date.now()
  const resp = await fetch(
    'https://raw.githubusercontent.com/codeforpublic/morchana-core/master/available',
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    },
  )
  const txt = (await resp.text()).trim()
  return txt === '1'
}

export const useSystemAvailable = () => {
  const [isAvailable, setIsAvailable] = useState(true)
  useEffect(() => {
    const check = () => {
      console.log('checking...')
      isServiceAvailable().then(bool => {
        console.log('ServiceAvailable is ', bool)
        if (bool) {          
          setIsAvailable(true)
        } else {
          backgroundTracking.stop()
          setIsAvailable(false)
          Alert.alert(I18n.t('system_closed'))
        }
      }).catch()
    }
    let prevState
    AppState.addEventListener('change', state => {
      if (state === 'active' && prevState !== state) {
        check()
      }
      prevState = state
    })
    check()
  }, [])

  if (!isAvailable) {
    return false
  }
  return true
}

export const withSystemAvailable = Component => props => {
  const isAvailable = useSystemAvailable()
  if (!isAvailable) {
    return null
  }
  return <Component {...props} />
}
