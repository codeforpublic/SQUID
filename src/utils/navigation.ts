import { StackActions, NavigationActions } from "react-navigation"
import { useNavigation } from "react-navigation-hooks"
import { useCallback } from "react"

export const useResetTo = () => {
  const navigation = useNavigation()
  return useCallback((routeOptions) => {
    let action = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate(routeOptions),
      ],
      key: null,
    })
    navigation.dispatch(action)
  }, [])
}