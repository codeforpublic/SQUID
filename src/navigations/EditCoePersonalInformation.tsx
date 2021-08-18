import I18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { coeChecking, coeCheckingType } from '../services/coe-checking'
import { CoeCheckingForm } from '../components/CoeCheckingForm'
import { WhiteBackground } from '../components/WhiteBackground'
import { Alert } from 'react-native'
import { PageBackButton } from './2-Onboarding/components/PageBackButton'

export const EditCoePersonalInformation = () => {
  const [coeCheckingResultError, setCoeCheckingResultError] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<{ coeNo: string; rfNo: string }>({ coeNo: '', rfNo: '' })
  const navigation = useNavigation()

  const onSubmit = async ({ coeNo, rfNo }: coeCheckingType) => {
    try {
      const result = await coeChecking({ coeNo, rfNo })
      if (result) {
        navigation.goBack()
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
      coeNo: '123',
      rfNo: '456',
    })
  }, [])

  return (
    <WhiteBackground>
      <PageBackButton label={I18n.t('settings')} />
      <CoeCheckingForm
        isFormError={coeCheckingResultError}
        onSubmit={onSubmit}
        isLinked={false}
        formValues={formValues}
      />
    </WhiteBackground>
  )
}
