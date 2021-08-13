import React, { useEffect, useState, useRef } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

export const DebugTouchable = ({ onDebug, children }) => {
  const [pressCount, setPressCount] = useState(0)
  const ref = useRef<number>(0)
  useEffect(() => {
    if (pressCount > 5) {
      onDebug()
    }
  }, [pressCount])
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        clearTimeout(ref.current)
        ref.current = setTimeout(() => {
          setPressCount(0)
        }, 1 * 1000)
        setPressCount(pressCount + 1)
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  )
}
