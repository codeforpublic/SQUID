import React from 'react'
import { StyleSheet, View } from 'react-native'

const MainCard: React.FC = ({ children }) => {
  return (
    <View style={styles.containerCard}>
      <View style={styles.card}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    maxHeight: 550,
    margin: 15,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderColor: 'rgba(16, 170, 174, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 1,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
})
export default MainCard
