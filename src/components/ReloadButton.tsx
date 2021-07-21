import React from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

const ReloadButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.reloadButton}>
        <Image source={require('../assets/reload.png')} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  reloadButton: {
    marginVertical: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.56,
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
