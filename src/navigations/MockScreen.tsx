import React from 'react'
import { View, StyleSheet, Text, StatusBar } from 'react-native'
import { COLORS, FONT_FAMILY } from '../styles'
import SafeAreaView from 'react-native-safe-area-view';

import { useNavigation } from 'react-navigation-hooks'
import { PrimaryButton } from '../components/Button'
import { MyBackground } from '../covid/MyBackground';

export const MockScreen = ({ title, nextScreen }: { title: string, nextScreen?: string }) => {
  const navigation = useNavigation()
  return (
    <MyBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.content}>

        </View>
        {nextScreen && <View style={styles.footer}>
          <PrimaryButton title={"ถัดไป"} onPress={() => {
            navigation.navigate(nextScreen)
          }} />
        </View>}
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  footer: {
    alignItems: 'center'
  }
})
