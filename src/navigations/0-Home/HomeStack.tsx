import { createStackNavigator } from 'react-navigation'
import { Home } from './Home'
import { AgreementPolicy } from './AgreementPolicy'

export const HomeStack = createStackNavigator(
  {
    Home,
    AgreementPolicy,
  },
  {
    headerMode: 'none',
  },
)
