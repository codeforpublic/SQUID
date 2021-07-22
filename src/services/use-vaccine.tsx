import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { get } from 'lodash'
import moment, { Moment } from 'moment'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetch } from 'react-native-ssl-pinning'
import I18n from '../../i18n/i18n'
import { getAnonymousHeaders } from '../api'
import defaultConfig from '../assets/config.json'
import { API_URL, SSL_PINNING_CERT_NAME } from '../config'

export type Vaccination = {
  fullThaiName: string
  fullEngName: string
  passportNo: string
  vaccineRefName: string
  percentComplete: number
  immunizationDate: string
  hospitalName: string
  certificateSerialNo: string
  complete: boolean
}

const VACCINE_DATA_KEY = 'vaccineData'
const VACCINE_CONFIG_KEY = 'vaccineConfig'

let _data = defaultConfig
const getConfig = async () => {
  if (_data === defaultConfig) return _data

  let saveData = null
  try {
    saveData = await AsyncStorage.getItem(VACCINE_CONFIG_KEY)
  } catch (e) {
    console.error('Failed get  Vaccine config from storage\n', e)
  }

  if (saveData) {
    try {
      const data = JSON.parse(saveData)
      if (moment().diff(data.ts, 'week') < 4) {
        _data = data
        return _data
      }
    } catch (e) {
      console.error('Failed to use save Vaccine config\n', e)
    }
  }

  const url = process.env.VACCINE_CONFIG || 'https://files.thaialert.com/config.json'
  try {
    const data = (await axios.get(url)).data
    data.ts = new Date().toISOString()

    await AsyncStorage.setItem(VACCINE_CONFIG_KEY, JSON.stringify(_data))

    _data = data
  } catch (e) {
    console.error('Failed load Vaccine config\n', e)
  }

  return _data
}

const sendVaccineLog = (data: { event: string; cid: string; status?: string; data?: any; error?: any }) => {
  fetch(API_URL + '/log-scan-vaccine', {
    sslPinning: {
      certs: [SSL_PINNING_CERT_NAME],
    },
    headers: getAnonymousHeaders() as any,
    method: 'POST',
    body: JSON.stringify({
      data,
    }),
  })
    .then((res) => res.json())
    .then()
}

const getConfigPath = (path: string, index = '', cid = '') => path.replace('<INDEX>', index).replace('<CID>', cid)

const getVaccineValue = (data: any, path: string, index = '', cid = '') => {
  const cp = getConfigPath(path, index, cid)
  const p = get(data, cp)
  return p
}

const parseVaccineList = (data: any, cid: string, config: typeof defaultConfig) => {
  const length = +getVaccineValue(data, config.length, '', cid)
  const list: Vaccination[] = []
  for (let i = 0; i < length; i++) {
    let idx = i + ''
    list.push({
      fullThaiName: getVaccineValue(data, config.fullThaiName, idx, cid),
      fullEngName: getVaccineValue(data, config.fullEngName, idx, cid),
      passportNo: getVaccineValue(data, config.passportNo, idx, cid),
      vaccineRefName: getVaccineValue(data, config.vaccineRefName, idx, cid),
      percentComplete: +getVaccineValue(data, config.percentComplete, idx, cid),
      immunizationDate: getVaccineValue(data, config.immunizationDate, idx, cid),
      hospitalName: getVaccineValue(data, config.hospitalName, idx, cid),
      certificateSerialNo: getVaccineValue(data, config.certificateSerialNo, idx, cid),
      complete: !!getVaccineValue(data, config.complete, idx, cid),
    })
  }

  return list
}

export const isVaccineURL = async (url: string) => {
  const config = await getConfig()
  return url && url.includes(config.url)
}

const requestVaccineData = async (cid: string) => {
  const config = await getConfig()

  const method = config.get_url_method
  const url = getConfigPath(config.get_url, '', cid)
  const body = getConfigPath(config.get_url_body, '', cid)

  try {
    const { data } = await (axios as any)[method](url, JSON.parse(body))
    sendVaccineLog({ event: 'REQUEST', status: 'SUCCESS', data, cid })
    return parseVaccineList(data, cid, config)
  } catch (error) {
    console.error(error)
    sendVaccineLog({ event: 'REQUEST', status: 'ERROR', error, cid })
  }

  return []
}

const VaccineContext = createContext<{
  cid?: string
  vaccineList?: Vaccination[]
  requestVaccine?: (url: string) => Promise<{ status: 'ERROR' | 'SUCCESS'; errorTitle?: string; errorMessage?: string }>
  getUpdateTime?: () => Moment | null
  reloadVaccine?: () => void
  resetVaccine?: () => void
}>({})

export const VaccineProvider: React.FC = ({ children }) => {
  const [[vaccineList, cid, updateTime], setVaccineList] = useState<[Vaccination[], string, string]>([[], '', ''])

  useEffect(() => {
    AsyncStorage.getItem(VACCINE_DATA_KEY).then((res) => {
      res && setVaccineList(JSON.parse(res))
    })
  }, [])

  const requestAndSave = React.useCallback(async (_cid: string) => {
    try {
      const list = await requestVaccineData(_cid)
      const ts = new Date().toISOString()
      if (!Array.isArray(list) || !list.length) {
        sendVaccineLog({ event: 'PARSE', status: 'FAILED', cid: _cid })
        return {
          status: 'ERROR',
          errorMessage: I18n.t('vaccine_record_not_found_title'),
          errorTitle: I18n.t('vaccine_record_not_found_message'),
        } as const
      }

      setVaccineList([list, _cid, ts])

      AsyncStorage.setItem(VACCINE_DATA_KEY, JSON.stringify([list, _cid, ts]))
    } catch (e) {
      sendVaccineLog({ event: 'PARSE', status: 'FAILED', cid: _cid })
      return {
        status: 'ERROR',
        errorMessage: I18n.t('vaccine_connection_failed_title'),
        errorTitle: I18n.t('vaccine_connection_failed_message'),
      } as const
    }

    sendVaccineLog({ event: 'PARSE', status: 'SUCCESS', cid: _cid })
    return { status: 'SUCCESS' } as const
  }, [])

  const resetVaccine = React.useCallback(() => {
    sendVaccineLog({ event: 'CLEAR', cid })
    setVaccineList([[], '', ''])
    AsyncStorage.removeItem(VACCINE_DATA_KEY)
  }, [cid])

  const reloadVaccine = React.useCallback(() => {
    sendVaccineLog({ event: 'REFRESH', cid })
    requestAndSave(cid)
  }, [cid, requestAndSave])

  const requestVaccine = React.useCallback(
    async (url: string) => {
      sendVaccineLog({ event: 'QRSCAN', cid, data: url })

      const urlParam = url.split('?')[1]
      const m = decodeURIComponent(urlParam).match(/cid=\{([^}]+)\}/)
      const id = (m && m[1]) + ''

      return await requestAndSave(id)
    },
    [requestAndSave, cid],
  )

  const getUpdateTime = React.useCallback(() => {
    return updateTime ? moment(updateTime).locale(I18n.locale || 'th') : null
  }, [updateTime])

  return (
    <VaccineContext.Provider value={{ vaccineList, requestVaccine, getUpdateTime, cid, reloadVaccine, resetVaccine }}>
      {children}
    </VaccineContext.Provider>
  )
}

export const useVaccine = () => {
  return useContext(VaccineContext)
}
