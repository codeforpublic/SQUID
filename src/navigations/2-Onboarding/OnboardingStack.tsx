import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { OnboardLocation } from './OnboardLocation'
import { OnboardFace } from './OnboardFace'
import { OnboardFaceCamera } from './OnboardFaceCamera'
import { OnboardProgressing } from './OnboardProgressing'
import { OnboardComplete } from './OnboardComplete'

const OnboardFaceStack = createStackNavigator(
  {
    OnboardFace,
    OnboardFaceCamera,
  },
  {
    headerMode: 'none',
  },
)

export const OnboardingStack = createStackNavigator(
  {
    OnboardFaceStack,
    OnboardLocation,
    OnboardProgressing,
    OnboardComplete,
  },
  {
    headerMode: 'none',
  },
)
