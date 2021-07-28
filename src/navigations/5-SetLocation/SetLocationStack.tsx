import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { LocationHistory } from './LocationHistory'
import { SetLocationHome } from './SetLocationHome'
import { SetLocationMapWebView } from './SetLocationMapWebView'

const Stack = createStackNavigator()
export const SetLocationStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='LocationHistory' component={LocationHistory} />
      <Stack.Screen name='SetLocationHome' component={SetLocationHome} />
      <Stack.Screen name='SetLocationTemplate' component={SetLocationMapWebView} />
    </Stack.Navigator>
  )
}
