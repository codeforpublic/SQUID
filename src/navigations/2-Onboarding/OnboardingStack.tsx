import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { OnboardLocationPermission } from './OnboardLocationPermission'
/*
  handle deeplink
  fightcovid19://app/:appId
*/
export const OnboardingStack = createStackNavigator(
  {
    OnboardFace: () => <MockScreen title="รูปถ่ายหน้าตรง" nextScreen="OnboardLocation" />,
    OnboardLocation: () => <OnboardLocationPermission />,
    OnboardProgressing: () => <MockScreen title="กำลังดำเนินการ..." nextScreen="OnboardComplete" />,
    OnboardComplete: () => <MockScreen title="ลงทะเบียนสำเร็จ" nextScreen="MainApp" />,
  },
  {
    headerMode: "none"
  }
)
