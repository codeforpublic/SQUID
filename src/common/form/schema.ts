import * as Yup from 'yup'
import { useMemo } from 'react'

export const getInputSchema = (dataInputs: DataInput[]) => {
  return Yup.object().shape(
    dataInputs.reduce((map, obj) => {
      let schema
      switch (obj.inputType) {
        case 'Date':
          schema = Yup.string()
          break
        case 'Select <Nationality>':
          schema = Yup.string()
          break
        case 'M/F':
          schema = Yup.string().oneOf(['M', 'F'])

          break
        case 'Text Single Line':
          schema = Yup.string()
          break
        case 'Text <Phone Number>':
          const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
          schema = Yup.string().matches(phoneRegExp, 'รูปแบบเบอร์โทรศัพท์ผิด')

          break
        case 'Text <Email>':
          schema = Yup.string()
            .trim()
            .lowercase()
            .email('ฟอร์แมตอีเมลผิด')
          /* should check from di */

          break
        case 'Text <National ID>':
          const nationalIdExp = /^[0-9]{13}$/

          schema = Yup.string()
            .matches(nationalIdExp, '13 หลัก')

            .test('isIDCard', 'รหัสบัตรประชาชนไม่ถูกต้อง', checkID)

          break
        default:
          const inputType: string = obj.inputType
          if (inputType.includes('/')) {
            schema = Yup.string().oneOf(['true', 'false'])
          } else {
            schema = Yup.string()
          }
          break
      }
      if (obj.required) {
        schema = schema.required('โปรดระบุ')
      }
      map[obj.id] = schema
      return map
    }, {} as any),
  )
}

export const useInputSchema = (dataInputs: DataInput[]) => {
  return useMemo(() => {
    return getInputSchema(dataInputs)
  }, [dataInputs])
}

function checkID(id: string) {
  if (!id || id.length != 13) return false
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseFloat(id.charAt(i)) * (13 - i)
  if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false
  return true
}
