import axios from 'axios'
import { useEffect, useState } from 'react'

export type Vaccination = {
  url: string
  get_url: string
  fullThaiName: string
  fullEngName: string
  passportNo: string
  vaccineRefName: string
  percentComplete: number
  visitImmunization: {
    immunizationDate: string
    hospitalName: string
  }[]
  certificateSerialNo: string
  complete: boolean
}

export const useMorprom = (cid: string) => {
  const url = 'https://co19cert.moph.go.th/moph-backend/api/immunization-stat/get'
  const _data = { cid: `{${cid}}` }
  const v: Vaccination = {
    url: '',
    get_url: '',
    fullThaiName: '',
    fullEngName: '',
    passportNo: '',
    vaccineRefName: '',
    percentComplete: 0,
    visitImmunization: [{ immunizationDate: '', hospitalName: '' }],
    certificateSerialNo: '',
    complete: false,
  }
  const [data, setData] = useState<Vaccination>(v)

  useEffect(() => {
    ;(async function () {
      const { data: d } = await axios.post(url, _data)
      setData({
        ...v,
        url: '',
        get_url: '',
        fullThaiName: d.fullThaiName,
        fullEngName: d.fullEngName,
        passportNo: d.passportNo,
        vaccineRefName: d.vaccineRefName,
        percentComplete: d.percentComplete,
        visitImmunization: d.visitImmunization,
        certificateSerialNo: d.certificateSerialNo,
        complete: d.complete,
      })
    })()
  }, [_data, v])

  return { data }
}
