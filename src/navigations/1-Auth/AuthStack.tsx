import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthOTP } from './AuthOTP'
import { AuthPhone } from './AuthPhone'
import { OnboardPhone } from './OnboardPhone'

const Stack = createStackNavigator()

export const AuthStack = () => {
  return (
    <Stack.Navigator headerMode='none' mode='modal'>
      <Stack.Screen name='OnboardPhone' component={OnboardPhone} />
      <Stack.Screen name='AuthPhone' component={AuthPhone} />
      <Stack.Screen name='AuthOTP' component={AuthOTP} />
    </Stack.Navigator>
  )
}
