import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { MockScreen } from '../MockScreen'
import { QQuestion1 } from './QQuestion1'

export const QuestionaireStack = createStackNavigator(
  {
    QuestionaireHome: () => (
      <MockScreen title="QuestionaireHome" nextScreen="QQuestion1" />
    ),
    QQuestion1: {
      screen: QQuestion1,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    QuestionaireSummary: () => (
      <MockScreen title="QuestionaireSummary" nextScreen="MainApp" />
    ),
  },
  {
    headerMode: 'none',
  },
)
