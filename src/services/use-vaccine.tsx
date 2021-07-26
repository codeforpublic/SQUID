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

type VaccineContextType = Partial<{
  cid: string
  vaccineList: Vaccination[]
  requestVaccine: (url: string) => Promise<{ status: 'ERROR' | 'SUCCESS'; errorTitle?: string; errorMessage?: string }>
  getUpdateTime: () => Moment | null
  reloadVaccine: () => void
  resetVaccine: () => void
  isVaccineURL: (url: string) => void
  getVaccineUserName: (vaccine: Vaccination) => string
}>

const VACCINE_DATA_KEY = 'vaccineData'
const VACCINE_CONFIG_KEY = 'vaccineConfig'

const getConfig = async () => {
  const url = process.env.VACCINE_CONFIG || 'https://files.thaialert.com/config.json'
  try {
    const data = { ...defaultConfig, ...(await axios.get(url)).data, ts: new Date().toISOString() }
    if (data) {
      await AsyncStorage.setItem(VACCINE_CONFIG_KEY, JSON.stringify(data))
      return data
    }
  } catch (e) {
    console.error('Failed load Vaccine config\n', e)
  }

  let saveData = null
  try {
    saveData = await AsyncStorage.getItem(VACCINE_CONFIG_KEY)
  } catch (e) {
    console.error('Failed get  Vaccine config from storage\n', e)
  }

  if (saveData) {
    try {
      return { ...defaultConfig, ...JSON.parse(saveData) }
    } catch (e) {
      console.error('Failed to use save Vaccine config\n', e)
    }
  }

  return defaultConfig
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
    .catch((e) => console.error('sendVaccineLog', e))
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

const requestVaccineData = async (cid: string, config: typeof defaultConfig) => {
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

const VaccineContext = createContext<VaccineContextType>({})

export const VaccineProvider: React.FC = ({ children }) => {
  const [[vaccineList, cid, updateTime], setVaccineList] = useState<[Vaccination[], string, string]>([[], '', ''])
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    AsyncStorage.getItem(VACCINE_DATA_KEY).then((res) => {
      res && setVaccineList(JSON.parse(res))
    })
    getConfig().then(setConfig)
  }, [])

  const isVaccineURL = React.useCallback(
    (url: string) => {
      return url && url.includes(config.url)
    },
    [config],
  )

  const requestAndSave = React.useCallback(
    async (_cid: string) => {
      try {
        const list = await requestVaccineData(_cid, config)
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
    },
    [config],
  )

  const getVaccineUserName = (vac: Vaccination) => {
    let unusedString = [',', '.']

    function removePrefixName(name: string, prefixNames: string[]) {
      function compare(pf: string) {
        return name.toLocaleLowerCase().indexOf(pf.toLocaleLowerCase()) === 0
      }
      const prefix = prefixNames.find(compare)
      if (prefix) {
        name = name.replace(prefix, '')
      }
      for (let char of unusedString) {
        name = name.replace(char, '')
      }
      return name.trim()
    }

    const thaiName = removePrefixName(vac.fullThaiName || '', config.thPrefixName)
    const engName = removePrefixName(vac.fullEngName || '', config.enPrefixName)

    if (I18n.locale === 'th') {
      if (thaiName) {
        return thaiName
      } else {
        return engName
      }
    } else {
      if (engName) {
        return engName
      } else {
        return thaiName
      }
    }
  }

  const resetVaccine = React.useCallback(() => {
    // sendVaccineLog({ event: 'CLEAR', cid })
    setVaccineList([[], '', ''])
    AsyncStorage.removeItem(VACCINE_DATA_KEY)
  }, [])

  const reloadVaccine = React.useCallback(() => {
    sendVaccineLog({ event: 'REFRESH', cid })
    requestAndSave(cid)
  }, [cid, requestAndSave])

  const requestVaccine = React.useCallback(
    async (url: string) => {
      sendVaccineLog({ event: 'QRSCAN', cid, data: url })

      let id = ''
      for (let matcher of config.matchers) {
        let idx = matcher[1]
        let m = url.match(new RegExp('' + matcher[0]))
        console.log('url', url)
        console.log('m', m)
        console.log('id', id)
        if (m && m[+idx]) {
          id = m[+idx]
          break
        }
      }

      return await requestAndSave(id)
    },
    [requestAndSave, cid, config],
  )

  const getUpdateTime = React.useCallback(() => {
    return updateTime ? moment(updateTime).locale(I18n.locale || 'th') : null
  }, [updateTime])

  return (
    <VaccineContext.Provider
      value={{
        cid,
        vaccineList,
        requestVaccine,
        getUpdateTime,
        reloadVaccine,
        resetVaccine,
        isVaccineURL,
        getVaccineUserName,
      }}
    >
      {children}
    </VaccineContext.Provider>
  )
}

export const useVaccine = () => {
  return useContext(VaccineContext)
}
