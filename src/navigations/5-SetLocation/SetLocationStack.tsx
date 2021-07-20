import { createStackNavigator } from 'react-navigation'
import { LocationHistory } from './LocationHistory'
import { SetLocationHome } from './SetLocationHome'
// import { SetLocationMap } from './SetLocationMap'
import { SetLocationMapWebView } from './SetLocationMapWebView'

export const SetLocationStack = createStackNavigator(
  {
    LocationHistory: LocationHistory,
    SetLocationHome: SetLocationHome,
    // SetLocationMap: SetLocationMap,
    SetLocationTemplate: SetLocationMapWebView,
  },
  {
    headerMode: 'none',
  },
)
