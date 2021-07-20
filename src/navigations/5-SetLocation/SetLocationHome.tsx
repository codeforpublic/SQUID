import React, { useCallback } from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native'

import { COLORS } from '../../styles'
import { FormHeader } from '../../components/Form/FormHeader'
import { LocationList } from './LocationList'
import { QuarantineOverview } from './QuarantineOverview'

export const SetLocationHome: React.FC = ({ navigation }) => {
  const onBack = useCallback(() => {
    navigation.pop()
  }, [navigation])

  return (
    <View
      style={[
        styles.flexContainer,
        {
          backgroundColor: COLORS.PRIMARY_DARK,
        },
      ]}
    >
      <SafeAreaView />
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.fillHeight} bounces={false}>
        <FormHeader
          onBack={onBack}
          white
          whiteLogo
          style={[styles.flexContainer, styles.paddingTop]}
          // title={I18n.t('quarantine_work_from_home')}
        >
          <View style={styles.container} />
          <View style={styles.formContainer}>
            <QuarantineOverview />
            <View style={styles.line} />
            <LocationList navigation={navigation} />
          </View>
        </FormHeader>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  paddingTop: {
    paddingTop: 10,
  },
  headerLocation: {
    flex: 1,
    flexDirection: 'row',
  },
  fillHeight: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 24,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    paddingTop: 30,
  },
  line: {
    width: '100%',
    height: 6,
    backgroundColor: '#C4C4C4',
  },
})
