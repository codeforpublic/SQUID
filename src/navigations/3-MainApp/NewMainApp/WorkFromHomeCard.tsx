import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MainCard from '../../../components/MainCard'
import { FONT_BOLD, FONT_SIZES } from '../../../styles'
import { QuarantineSummary } from '../MainApp/QuarantineSummary'

const WorkFromHomeCard: React.FC = () => {
  return (
    <MainCard>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>WFH Mode</Text>
      </View>
      <QuarantineSummary />
    </MainCard>
  )
}

const styles = StyleSheet.create({
  cardHeader: {
    borderTopEndRadius: 14,
    borderTopStartRadius: 14,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E4E87',
  },
  cardHeaderText: {
    width: '100%',
    color: 'white',
    textAlign: 'center',
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_BOLD,
  },
})
export default WorkFromHomeCard
