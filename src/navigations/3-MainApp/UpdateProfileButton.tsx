import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import {
  StyleSheet,
  TouchableHighlight,
  
} from 'react-native'
import FeatureIcon from 'react-native-vector-icons/Feather'
import 'moment/locale/th'
import { useNavigation } from 'react-navigation-hooks'

export const UpdateProfileButton = ({ width, style, onChange }) => {
  const navigation = useNavigation()
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => {
        navigation.navigate('MainAppFaceCamera', { setUri: onChange })
      }}
      style={[styles.container, {
        width: width,
        height: width,
        borderRadius: Math.floor(width / 2),        
      }, style]}
    >
      <FeatureIcon
        name="camera"
        size={Math.floor((60 / 100) * width)}
      />
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',        
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  }
})