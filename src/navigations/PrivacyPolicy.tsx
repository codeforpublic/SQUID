import React, { useState } from 'react'
import { MyBackground } from '../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar, View, Text, StyleSheet, ScrollView } from 'react-native'
import { PrimaryButton } from '../components/Button'
import { useNavigation } from 'react-navigation-hooks'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../styles'
import { CheckBox } from 'react-native-elements'
import { FormHeader } from '../components/Form/FormHeader'
import { agreementText } from './const'

export const PrivacyPolicy = () => {
  const navigation = useNavigation()
  const [agree, setAgree] = useState(false)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle="light-content" />
      <FormHeader backIcon="close">
        <View style={styles.header}>
          <Text style={styles.title}>นโยบายความเป็นส่วนตัว </Text>
          <Text style={styles.subtitle}>ในการใช้บริการ</Text>
        </View>
      </FormHeader>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: 'white',
          }}
          style={{
            borderColor: COLORS.GRAY_2,
            borderWidth: 1,
            borderRadius: 4,
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.agreement}>{agreementText} </Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={'ปิด'}
          style={{ width: '100%' }}
          containerStyle={{ width: '100%' }}
          onPress={() => {
            navigation.pop()
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontFamily: FONT_BOLD,
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[500],
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  agreement: {
    fontSize: FONT_SIZES[500],
    lineHeight: 24,
    color: COLORS.GRAY_4,
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
})
