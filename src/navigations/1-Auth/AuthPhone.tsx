import React from 'react'
import { MockScreen } from '../MockScreen'

export const AuthPhone = () => {
  return (
    <MockScreen title="กรอกเบอร์โทรศัพท์" nextScreen="AuthOTP" />
  )
}