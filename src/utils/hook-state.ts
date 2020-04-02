import { EventRegister } from 'react-native-event-listeners'
import { useState, useEffect, useCallback } from 'react'

type Unsubscriber = () => void
const HOOK_STATE_PREFIX = 'HookState'
export class HookState {
  name: string
  changeEventName: string
  data: any
  getData(key) {}
  setData(key, value) {}
  constructor(name) {
    this.name = name
    this.changeEventName = 'change:' + HOOK_STATE_PREFIX + ':' + name
  }
  save() {
    EventRegister.emit(this.changeEventName, this.data)
  }
  subscribeToChange(callback): Unsubscriber {
    const eventId = EventRegister.addEventListener(
      this.changeEventName,
      callback,
    )

    return () => EventRegister.removeEventListener(eventId as string)
  }
}
type valueof<T> = T[keyof T]

export const createUseHookState = <DataType>(hookStateInstance: HookState) => () => {
  const [data, _setData] = useState<DataType>(hookStateInstance.data)
  useEffect(() => {
    const unsubscribe = hookStateInstance.subscribeToChange(_setData)
    return () => unsubscribe()
  }, [])
  
  const setData = useCallback((key: keyof DataType, value: valueof<DataType>) => {
    hookStateInstance.setData(key, value)
  }, [])

  return [data, setData]
}