import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { QuestionaireForm } from './QuestionaireForm'
import { QuestionaireSummary } from './QuestionaireSummary'
import { QuestionaireHome } from './QuestionaireHome'

export const QuestionaireStack = createStackNavigator(
  {
    QuestionaireHome: QuestionaireHome,
    QuestionaireForm: {
      screen: QuestionaireForm,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    QuestionaireSummary: QuestionaireSummary
  },
  {
    headerMode: 'none',
  },
)
