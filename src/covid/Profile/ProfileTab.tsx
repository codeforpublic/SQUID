import { createStackNavigator } from 'react-navigation'
import { Profile } from './Profile'
import { EditProfile } from './EditProfile'

export const ProfileTabStack = createStackNavigator(
  {
    Me: { screen: Profile },
    EditProfile: { screen: EditProfile },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Me',
  },
)
