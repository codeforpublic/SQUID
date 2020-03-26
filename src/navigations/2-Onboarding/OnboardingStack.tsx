import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { OnboardLocation } from './OnboardLocation'
import { OnboardFace } from './OnboardFace'
import { OnboardProgressing } from './OnboardProgressing'
import { OnboardComplete } from './OnboardComplete'

export const OnboardingStack = createStackNavigator(
  {
    OnboardFace,
    OnboardLocation,
    OnboardProgressing,
    OnboardComplete,
  },
  {
    headerMode: 'none',
  },
)
