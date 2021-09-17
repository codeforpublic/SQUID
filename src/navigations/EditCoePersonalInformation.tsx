import I18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import { coeChecking, coeCheckingType } from '../services/coe-checking'
import { CoeCheckingForm } from '../components/CoeCheckingForm'
import { WhiteBackground } from '../components/WhiteBackground'
import { Alert } from 'react-native'
import { PageBackButton } from './2-Onboarding/components/PageBackButton'
import { userPrivateData } from '../state/userPrivateData'
import { useResetTo } from '../utils/navigation'

export const EditCoePersonalInformation = () => {
  const [coeCheckingResultError, setCoeCheckingResultError] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<{ coeNo: string; rfNo: string }>({ coeNo: '', rfNo: '' })
  const resetTo = useResetTo()

  const onSubmit = async ({ coeNo, rfNo }: coeCheckingType) => {
    try {
      const result = await coeChecking({ coeNo, rfNo })
      if (result) {
        userPrivateData.setData('coeNo', coeNo.toUpperCase())
        userPrivateData.setData('coeRfNo', rfNo)
        resetTo({ name: 'MainApp' })
      } else {
        setCoeCheckingResultError(true)
      }
    } catch (error) {
      Alert.alert(I18n.t('error'), I18n.t('system_error'))
      console.log(error)
    }
  }

  useEffect(() => {
    setFormValues({
      coeNo: userPrivateData.getData('coeNo')?.toString() || '',
      rfNo: userPrivateData.getData('coeRfNo')?.toString() || '',
    })
  }, [])

  return (
    <WhiteBackground>
      <PageBackButton label={I18n.t('back_lower')} />
      <CoeCheckingForm
        isFormError={coeCheckingResultError}
        onSubmit={onSubmit}
        formValues={formValues}
        setIsFormError={setCoeCheckingResultError}
      />
    </WhiteBackground>
  )
}
