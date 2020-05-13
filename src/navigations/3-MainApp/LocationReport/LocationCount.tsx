import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome5'

export const LocationCount = (props) => {
  const [locationName, setLocationName] = useState(props.name)
  const [iconName, setIconName] = useState("")

  useEffect(() => {
    if (props.name === "home") {
      setIconName("home");
      setLocationName("ที่พัก");
    } else {
      setIconName("building");
      setLocationName("ที่ทำงาน");
    }
  }, [props.name]);

  return (
    <View>
      <Icon
        name={iconName}
        size={20}
      >
      </Icon>
      <Text>{props.size}</Text>
    </View>
  )
}