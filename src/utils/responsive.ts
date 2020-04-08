import { Dimensions } from 'react-native'

const deviceWidth = Dimensions.get('window').width

export const isSmallDevice = deviceWidth <= 400
