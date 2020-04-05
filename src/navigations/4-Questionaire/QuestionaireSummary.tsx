import React, { useEffect } from 'react'
import { useResetTo } from '../../utils/navigation'

export const QuestionaireSummary = ({ navigation }) => {
  const resetTo = useResetTo()
  useEffect(() => {
    resetTo({ routeName: 'MainApp' })
  }, [])
  return null
}
