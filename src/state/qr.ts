import { getQRData, getTagData } from '../api'
import { useEffect, useReducer, useRef } from 'react'
import moment from 'moment-timezone'
import 'moment/locale/th'
import AsyncStorage from '@react-native-community/async-storage'
import _ from 'lodash'

import I18n from '../../i18n/i18n';
interface QRData {
  data: {
    anonymousId: string
    code: string
    tag?: Tag    
  }
  qr: {
    type: string
    base64: string
  }
}

export enum QR_STATE {
  LOADING = 'loading',
  FAILED = 'failed',
  NORMAL = 'normal',
  OUTDATE = 'outdate',
  EXPIRE = 'expire',
  NOT_VERIFIED = 'not_verified'
}
enum QR_ACTION {
  UPDATE = 'update',
  LOADING = 'loading'
}

type SelfQRType = {
  qrData: SelfQR,
  qrState: QR_STATE,
  error: any,
}

export const useSelfQR = () => {
  const [state, dispatch] = useReducer<(state: SelfQRType, action: any) => SelfQRType>(
    (state, action) => {
      switch (action.type) {
        case QR_ACTION.LOADING:
          return { ...state, qrState: QR_STATE.LOADING }
        case QR_ACTION.UPDATE:
          return { ...state, ...action.payload }
        default:
          return state
      }
    },
    {
      qrData: null,
      qrState: QR_STATE.LOADING,
      error: null,
    },
  )
  const tlRef = useRef<NodeJS.Timeout>()  

  const refreshQR = async () => {
    clearTimeout(tlRef.current)
    try {
      dispatch({
        type: QR_ACTION.LOADING
      })
      const _qrData = await getQRData()
      const qrData = await SelfQR.setCurrentQRFromQRData(_qrData)
      const qrState = SelfQR.getCurrentState()
      dispatch({
        type: QR_ACTION.UPDATE,
        payload: { qrData, qrState, error: null },
      })
      tlRef.current = setTimeout(refreshQR, 2 * 60 * 1000) // Update after 2 min
    } catch (error) {
      const qrState = SelfQR.getCurrentState()
      dispatch({
        type: QR_ACTION.UPDATE,
        payload: { qrState, error },
      })
      tlRef.current = setTimeout(refreshQR, 10 * 1000) // Retry after 10 sec
    }
  }
  
  useEffect(() => {
    

    const setQRFromStorage = async () => {
      const qrData = await SelfQR.getCurrentQR()
      dispatch({ type: QR_ACTION.UPDATE, payload: { qrData } })
    }

    setQRFromStorage().then(() => refreshQR())
    return () => {
      clearTimeout(tlRef.current)
    }
  }, [])

  return { ...state, refreshQR }
}

class QR {
  code: string
  constructor(code) {
    this.code = code
  }
  getStatusColor() {
    return STATUS_COLORS[this.code]
  }
  getLevel() {
    return LEVELS[this.code]
  }
  getScore() {
    return SCORES[this.code]
  }
  getLabel() {
    return LABELS[this.code]
  }
}

interface Tag {
  id: string
  title: string
  description: string
  tagRole?: TagRole
  tagRoleId?: string
}

type TagRole = {
  id: string
  title: string
  color?: string
}
export class SelfQR extends QR {
  qrData: QRData
  code: string
  tag?: Tag  
  timestamp: number

  private static currentQR: SelfQR = null

  public static async getCurrentQR() {
    if (!this.currentQR) {
      try {
        const selfQRData = await AsyncStorage.getItem('selfQRData')
        if (selfQRData) {
          this.currentQR = new SelfQR(
            JSON.parse(selfQRData),
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
    return this.currentQR
  }

  public static async setCurrentQRFromQRData(qrData: QRData) {
    try {
      await AsyncStorage.setItem('selfQRData', JSON.stringify(qrData))
    } catch (error) {
      console.log(error)
    }
    this.currentQR = new SelfQR(qrData)
    return this.currentQR
  }

  public static getCurrentState() {
    if (!this.currentQR) {
      return QR_STATE.FAILED
    }
    const time = Date.now() - this.currentQR.timestamp
    if (time < 3 * 60 * 1000) {
      return QR_STATE.NORMAL
    }
    if (time < 10 * 60 * 1000) {
      return QR_STATE.OUTDATE
    }
    return QR_STATE.EXPIRE
  }

  constructor(qrData: QRData) {
    super(qrData.data.code)
    this.qrData = qrData
    this.timestamp = Date.now()
    this.tag = qrData.data?.tag
  }
  getAnonymousId() {
    return this.qrData.data.anonymousId
  }
  getQRImageURL() {
    return `data:${this.qrData.qr.type};base64,` + this.qrData.qr.base64
  }
  getCreatedDate(): moment {
    return moment(this.timestamp).locale('th')
  }
  getTagTitle(): string | undefined {
    return this.tag?.title
  }
  getTagDescription(): string | undefined {
    return this.tag?.tagRole?.title
  }
  getTagColor() {
    return this.tag?.tagRole?.color
  }
}

interface DecodedResult {
  _: [string, 'G' | 'Y' | 'O' | 'R', string | undefined, string | undefined]
  iat: number
  iss: string
}
export class QRResult extends QR {
  iat: number
  code: string
  annonymousId: string
  tagId?: string
  age?: string
  iss: string
  constructor(decodedResult: DecodedResult) {
    // console.log('decodedResult', decodedResult)
    super(CODE_MAP[decodedResult._[1]])
    this.annonymousId = decodedResult._[0]
    this.tagId = decodedResult._[2]
    this.age = decodedResult._[3]
    this.iat = decodedResult.iat
    this.iss = decodedResult.iss
  }
  getUserCreatedDate() {
    if (!this.age) {
      return null
    }
    return moment().subtract(this.age, 'days').locale('th')
  }
  getCreatedDate(): moment {
    return moment(this.iat * 1000).locale('th')
  }
  getTag(): Tag | undefined {
    if (!this.tagId) {
      return
    }
    return tagManager.getTag(this.tagId)
  }
  getAge(): string {
    return resolveAge(this.age)
  }
}

const resolveAge = (age: string) => {
  if (!age) return
  const mapAge = [
    ['y', I18n.t('year')],
    ['w', I18n.t('week')],
    ['d', I18n.t('day')],
    ['h', I18n.t('hour')],
    ['m', I18n.t('minute')],
    ['s', I18n.t('second')],
  ]
  return _.reduce(mapAge, (p, c) => {
    return p.replace(c[0], c[1])
  }, age)
  // return age.replace('')
}

const STATUS_COLORS = {
  green: '#27C269',
  yellow: '#E5DB5C',
  orange: '#E18518',
  red: '#EC3131',
  DEFAULT: '#B4B5C1',
}
const LEVELS = {
  green: 1,
  yellow: 2,
  orange: 3,
  red: 4,
}
const SCORES = {
  green: 100,
  yellow: 80,
  orange: 50,
  red: 30,
}
const LABELS = {
  green: I18n.t('very_low_risk'),
  yellow: I18n.t('low_risk'),
  orange: I18n.t('medium_risk'),
  red: I18n.t('high_risk'),
}
const CODE_MAP = {
  G: 'green',
  Y: 'yellow',
  O: 'orange',
  R: 'red',
}
const GEN_ACTION = I18n.t('wash_hand_wear_mask_avoid_crowd')
const SPEC_ACTIONS = {
  YELLOW: I18n.t('maybe_other_disease_2d_not_better_go_see_doc'),
  ORANGE:
  I18n.t('went_to_risky_zone_quar_14d_observe_if_fever_respiratory_go_see_doc'),
  RED: I18n.t('go_see_doc'),
}

type TagMeta = {
  tags: Tag[]
  tagRoles: TagRole[]
}

class TagManager {
  tagMeta?: TagMeta
  mapRoles?: {[name: string]: TagRole}
  mapTags?: {[name: string]: Tag}
  constructor() {
    this.load()
  }
  async load() {
    const str = await AsyncStorage.getItem('TagMeta')
    if (str) {
      this.tagMeta = JSON.parse(str)
    }
  }
  async update() {
    const result: TagMeta = await getTagData()
    this.tagMeta = result
    this.mapRoles = _.mapKeys(result.tagRoles, r => r.id)  
    this.mapTags = _.mapKeys(result.tags, r => r.id)

    AsyncStorage.setItem('TagMeta', JSON.stringify(this.tagMeta))
  }
  getTag(tagId) {
    if (!this.tagMeta) {
      return
    }    
    const resolveTag = (tag: Tag): Tag => {
      if (tag) {
        const r = {
          ...tag,
          tagRole: this.mapRoles[tag.tagRoleId] || this.mapRoles.GEN,
        }
        delete r.tagRoleId
        return r
      }
      return null
    }
    const tag = this.mapTags[tagId]
    console.log('tagId', tagId, tag)
    return resolveTag(tag)
  }
}

export const tagManager = new TagManager()
