import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

const ReloadButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.reloadButton}>
        <Image source={require('../assets/reload.png')} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  reloadButton: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
})

export default ReloadButton
