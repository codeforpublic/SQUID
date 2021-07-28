import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { OnboardLocation } from './OnboardLocation'
import { OnboardFace } from './OnboardFace'
import { OnboardFaceCamera } from './OnboardFaceCamera'
import { OnboardProgressing } from './OnboardProgressing'
import { OnboardComplete } from './OnboardComplete'
import { OnboardBluetooth } from './OnboardBluetooth'
import { OnboardNotification } from './OnboardNotification'

const Stack1 = createStackNavigator()
const OnboardFaceStack = () => {
  return (
    <Stack1.Navigator headerMode='none'>
      <Stack1.Screen name='OnboardFace' component={OnboardFace} />
      <Stack1.Screen name='OnboardFaceCamera' component={OnboardFaceCamera} />
    </Stack1.Navigator>
  )
}

const Stack = createStackNavigator()
export const OnboardingStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='OnboardFaceStack' component={OnboardFaceStack} />
      <Stack.Screen name='OnboardLocation' component={OnboardLocation} />
      <Stack.Screen name='OnboardBluetooth' component={OnboardBluetooth} />
      <Stack.Screen name='OnboardNotification' component={OnboardNotification} />
      <Stack.Screen name='OnboardProgressing' component={OnboardProgressing} options={{ gesturesEnabled: false }} />
      <Stack.Screen name='OnboardComplete' component={OnboardComplete} options={{ gesturesEnabled: false }} />
    </Stack.Navigator>
  )
}
