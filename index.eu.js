import { AppRegistry } from 'react-native'
import { withEnforceUpdate } from './src/utils/enforce-update'

const App = withEnforceUpdate(true)(() => null)

AppRegistry.registerComponent('ThaiAlert', () => App)
