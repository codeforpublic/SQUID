import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { get } from 'lodash'
import moment, { Moment } from 'moment'
import React, { createContext, useContext, useEffect, useState } from 'react'
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

const MORPROM_DATA_KEY = 'morpromData'
const MORPROM_CONFIG_KEY = 'morpromConfig'

let _data = defaultConfig
const getConfig = async () => {
  if (_data === defaultConfig) return _data

  let saveData = null
  try {
    saveData = await AsyncStorage.getItem(MORPROM_CONFIG_KEY)
  } catch (e) {
    console.error('Failed get  Morprom config from storage\n', e)
  }

  if (saveData) {
    try {
      const data = JSON.parse(saveData)
      if (moment().diff(data.ts, 'week') < 4) {
        _data = data
        return _data
      }
    } catch (e) {
      console.error('Failed to use save Morprom config\n', e)
    }
  }

  const url = process.env.MORPROM_CONFIG || 'https://files.thaialert.com/config.json'
  try {
    const data = (await axios.get(url)).data
    data.ts = new Date().toISOString()

    await AsyncStorage.setItem(MORPROM_CONFIG_KEY, JSON.stringify(_data))

    _data = data
  } catch (e) {
    console.error('Failed load Morprom config\n', e)
  }

  return _data
}

const sendVaccineLog = (data: { event: string; cid: string; status?: string; data?: any; error?: any }) => {
  console.log('sendVaccineLog', data)
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
    .then((result) => console.log('sendVaccineLog RESULT:', result))
}

const getConfigPath = (path: string, index = '', cid = '') => path.replace('<INDEX>', index).replace('<CID>', cid)

const getMorpromValue = (data: any, path: string, index = '', cid = '') => {
  const cp = getConfigPath(path, index, cid)
  const p = get(data, cp)
  return p
}

const parseVaccineList = (data: any, cid: string, config: typeof defaultConfig) => {
  const length = +getMorpromValue(data, config.length, '', cid)

  // console.log('config', config)
  const list: Vaccination[] = []
  for (let i = 0; i < length; i++) {
    let idx = i + ''
    list.push({
      fullThaiName: getMorpromValue(data, config.fullThaiName, idx, cid),
      fullEngName: getMorpromValue(data, config.fullEngName, idx, cid),
      passportNo: getMorpromValue(data, config.passportNo, idx, cid),
      vaccineRefName: getMorpromValue(data, config.vaccineRefName, idx, cid),
      percentComplete: +getMorpromValue(data, config.percentComplete, idx, cid),
      immunizationDate: getMorpromValue(data, config.immunizationDate, idx, cid),
      hospitalName: getMorpromValue(data, config.hospitalName, idx, cid),
      certificateSerialNo: getMorpromValue(data, config.certificateSerialNo, idx, cid),
      complete: !!getMorpromValue(data, config.complete, idx, cid),
    })
  }

  return list
}

export const isMorpromURL = async (url: string) => {
  const config = await getConfig()
  return url && url.includes(config.url)
}

const requestMorpromData = async (cid: string) => {
  const config = await getConfig()

  const method = config.get_url_method
  const url = getConfigPath(config.get_url, '', cid)
  const body = getConfigPath(config.get_url_body, '', cid)
  // console.log('requestMorpromData', method, url, body)

  try {
    const { data } = await (axios as any)[method](url, JSON.parse(body))
    // console.log('morprom data', data)

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
  requestMorprom?: (url: string) => Promise<{ status: 'ERROR' | 'SUCCESS'; errorTitle?: string; errorMessage?: string }>
  getUpdateTime?: () => Moment | null
  reloadMorprom?: () => void
}>({})

export const VaccineProvider: React.FC = ({ children }) => {
  const [[vaccineList, cid, updateTime], setVaccineList] = useState<[Vaccination[], string, string]>([])

  useEffect(() => {
    AsyncStorage.getItem(MORPROM_DATA_KEY).then((res) => {
      // console.log('storage morprom get data', res)
      res && setVaccineList(JSON.parse(res))
    })
  }, [])

  const requestAndSave = React.useCallback(async (_cid: string) => {
    try {
      const list = await requestMorpromData(_cid)
      const ts = new Date().toISOString()
      if (!Array.isArray(list) || !list.length) {
        sendVaccineLog({ event: 'PARSE', status: 'FAILED', cid: _cid })
        return {
          status: 'ERROR',
          errorMessage: I18n.t('morprom_record_not_found_title'),
          errorTitle: I18n.t('morprom_record_not_found_message'),
        } as const
      }

      setVaccineList([list, _cid, ts])

      AsyncStorage.setItem(MORPROM_DATA_KEY, JSON.stringify([list, _cid, ts]))
    } catch (e) {
      sendVaccineLog({ event: 'PARSE', status: 'FAILED', cid: _cid })
      return {
        status: 'ERROR',
        errorMessage: I18n.t('morprom_connection_failed_title'),
        errorTitle: I18n.t('morprom_connection_failed_message'),
      } as const
    }

    sendVaccineLog({ event: 'PARSE', status: 'SUCCESS', cid: _cid })
    return { status: 'SUCCESS' } as const
  }, [])

  const reloadMorprom = React.useCallback(() => {
    sendVaccineLog({ event: 'REFRESH', cid })
    requestAndSave(cid)
  }, [cid, requestAndSave])

  const requestMorprom = React.useCallback(
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
    <VaccineContext.Provider value={{ vaccineList, requestMorprom, getUpdateTime, cid, reloadMorprom }}>
      {children}
    </VaccineContext.Provider>
  )
}

export const useVaccine = () => {
  return useContext(VaccineContext)
}
