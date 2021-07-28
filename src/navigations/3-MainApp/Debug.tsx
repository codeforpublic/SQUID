import React, { useCallback } from 'react'
import { StatusBar, StyleSheet, Text, ScrollView } from 'react-native'
import { COLORS, FONT_SIZES } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContactTracer } from '../../services/contact-tracing-provider'

export const Debug = () => {
  const { statusText } = useContactTracer()

  return (
    <MyBackground variant='light'>
      <StatusBar barStyle='dark-content' backgroundColor={COLORS.PRIMARY_LIGHT} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={styles.scrollView}>
          <Text>{statusText}</Text>
        </ScrollView>
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeader: {
    height: 56,
    justifyContent: 'flex-end',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: '#AAAAAA',
    fontSize: FONT_SIZES[400],
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  horizontalRow: {
    flexDirection: 'row',
  },
  leftArea: {
    flex: 1,
  },
  rightArea: {
    justifyContent: 'flex-start',
  },
  sectionText: {
    fontSize: FONT_SIZES[500],
    color: '#000000',
  },
  sectionDescription: {
    marginTop: 4,
    fontSize: FONT_SIZES[400],
    color: '#888888',
  },
  mediumText: {
    fontSize: FONT_SIZES[600],
    color: '#000000',
  },
  largeText: {
    fontSize: FONT_SIZES[700],
    color: '#000000',
  },
  sectionTitle: {
    fontSize: FONT_SIZES[700],
    fontWeight: '600',
    color: '#000000',
  },
  scrollView: {
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
  },
})
