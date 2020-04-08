import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { OnboardLocation } from './OnboardLocation'
import { OnboardFace } from './OnboardFace'
import { OnboardFaceCamera } from './OnboardFaceCamera'
import { OnboardProgressing } from './OnboardProgressing'
import { OnboardComplete } from './OnboardComplete'
import { OnboardBluetooth } from './OnboardBluetooth'
import { OnboardNotification } from './OnboardNotification'

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
    OnboardBluetooth,
    OnboardNotification,
    OnboardProgressing: {
      screen: OnboardProgressing,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    OnboardComplete: {
      screen: OnboardComplete,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
)
