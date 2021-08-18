import I18n from 'i18n-js'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { coeChecking, coeCheckingType } from '../../services/coe-checking'
import { CoeCheckingForm } from '../../components/CoeCheckingForm'
import { WhiteBackground } from '../../components/WhiteBackground'
import { Alert } from 'react-native'
import { PageBackButton } from './components/PageBackButton'

export const OnboardCoeChecking = () => {
  const [coeCheckingResultError, setCoeCheckingResultError] = useState<boolean>(false)
  const navigation = useNavigation()

  const onSubmit = async ({ coeNo, rfNo }: coeCheckingType) => {
    try {
      const result = await coeChecking({ coeNo, rfNo })
      if (result) {
        navigation.navigate('MainApp')
      } else {
        setCoeCheckingResultError(true)
      }
    } catch (error) {
      Alert.alert(I18n.t('error'), I18n.t('system_error'))
      console.log(error)
    }
  }

  return (
    <WhiteBackground>
      <PageBackButton label={I18n.t('research')} />
      <CoeCheckingForm isFormError={coeCheckingResultError} onSubmit={onSubmit} />
    </WhiteBackground>
  )
}
