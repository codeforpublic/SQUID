import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

export const useResetTo = () => {
  const navigation = useNavigation()

  return useCallback(
    (route: { name: string }, params?: any) => {
      if (params) navigation.setParams(params)
      navigation.reset({ index: 0, routes: [route] })
    },
    [navigation],
  )
}
