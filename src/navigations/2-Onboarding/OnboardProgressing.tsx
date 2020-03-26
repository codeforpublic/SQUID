import React from 'react'
import { MockScreen } from '../MockScreen'

export const OnboardProgressing = () => {
  return (
    <MockScreen title="กำลังดำเนินการ..." nextScreen="OnboardComplete" />
  )
}