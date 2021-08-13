import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { QuestionaireForm } from './QuestionaireForm'
import { QuestionaireHome } from './QuestionaireHome'
import { QuestionaireSummary } from './QuestionaireSummary'

const Stack = createStackNavigator()

export const QuestionaireStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='QuestionaireHome' component={QuestionaireHome} />
      <Stack.Screen name='QuestionaireForm' component={QuestionaireForm} options={{ gesturesEnabled: false }} />
      <Stack.Screen name='QuestionaireSummary' component={QuestionaireSummary} />
    </Stack.Navigator>
  )
}
