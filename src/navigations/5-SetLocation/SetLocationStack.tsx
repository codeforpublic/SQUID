import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { SetLocationHome } from './SetLocationHome'
import { SetLocationMap } from './SetLocationMap'

export const SetLocationStack = createStackNavigator(
  {
    SetLocationHome: SetLocationHome,
    SetLocationMap: SetLocationMap,
  },
  {
    headerMode: 'none',
  },
)
