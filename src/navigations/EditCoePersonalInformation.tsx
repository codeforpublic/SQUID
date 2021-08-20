import I18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { coeChecking, coeCheckingType } from '../services/coe-checking'
import { CoeCheckingForm } from '../components/CoeCheckingForm'
import { WhiteBackground } from '../components/WhiteBackground'
import { Alert } from 'react-native'
import { PageBackButton } from './2-Onboarding/components/PageBackButton'
import { userPrivateData } from '../state/userPrivateData'

export const EditCoePersonalInformation = () => {
  const [coeCheckingResultError, setCoeCheckingResultError] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<{ coeNo: string; rfNo: string }>({ coeNo: '', rfNo: '' })
  const [isLinked, setIsLinked] = useState<boolean>(false)
  const navigation = useNavigation()
  const getUserLinkStateFromAnonymousId = async (aId: string) => {
    console.log('anonymous id: ', aId)
    setIsLinked(true)
  }

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
      coeNo: userPrivateData.getData('coeNo')?.toString() || '',
      rfNo: userPrivateData.getData('coeRfNo')?.toString() || '',
    })
    getUserLinkStateFromAnonymousId(userPrivateData.getAnonymousId())
  }, [])

  return (
    <WhiteBackground>
      <PageBackButton label={I18n.t('settings')} />
      <CoeCheckingForm
        isFormError={coeCheckingResultError}
        onSubmit={onSubmit}
        isLinked={isLinked}
        formValues={formValues}
      />
    </WhiteBackground>
  )
}
