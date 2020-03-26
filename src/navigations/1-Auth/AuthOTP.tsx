import React from 'react'
import { MockScreen } from '../MockScreen'

export const AuthOTP = () => {
  return (
    <MockScreen title="กรอกรหัสจาก SMS" nextScreen="Onboarding" />
  )
}