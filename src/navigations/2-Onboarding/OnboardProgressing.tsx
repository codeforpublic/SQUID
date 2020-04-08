import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'react-navigation-hooks'
import { applicationState } from '../../state/app-state'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useResetTo } from '../../utils/navigation'

const STRING = {
  TITLE: 'กำลังดำเนินการ...',
  SUB_TITLE: 'กรุณารอสักครู่',
}

export const OnboardProgressing = () => {
  const navigation = useNavigation()
  const resetTo = useResetTo()
  useEffect(() => {
    setTimeout(() => {
      applicationState.setData('isPassedOnboarding', true)
      if (applicationState.getData('filledQuestionaire')) {
        navigation.navigate('OnboardComplete')
      } else {
        resetTo({ routeName: 'Questionaire' })
      }
    }, 1000)
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
      <View style={{ height: 56 }}></View>
      <View style={styles.header}>
        <Text style={styles.title}>{STRING.TITLE}</Text>
        <Text style={styles.subtitle}>{STRING.SUB_TITLE}</Text>
      </View>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLORS.BLACK_1} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginTop: 80,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
