import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Home } from './Home'
import { AgreementPolicy } from './AgreementPolicy'

const Stack = createStackNavigator()

export const HomeStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='AgreementPolicy' component={AgreementPolicy} />
    </Stack.Navigator>
  )
}
