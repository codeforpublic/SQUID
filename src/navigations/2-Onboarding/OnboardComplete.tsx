import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useNavigation } from 'react-navigation-hooks'
import { MyBackground } from '../../covid/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar, View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import { PrimaryButton } from '../../components/Button'

const STRING = {
  TITLE: 'ลงทะเบียนสำเร็จ',
  SUB_TITLE: 'เริ่มใช้งานได้ทันที',
  NEXT_BUTTON: 'เริ่มใช้งาน',
}

export const OnboardComplete = () => {
  const navigation = useNavigation()
  return (
    <MyBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={{ height: 56 }}></View>
        <View style={styles.header}>
          <Text style={styles.title}>{STRING.TITLE}</Text>
          <Text style={styles.subtitle}>{STRING.SUB_TITLE}</Text>
        </View>
        <View style={styles.content}>
          <View
            style={{
              position: 'absolute',
              height: '100%',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="circle" color={COLORS.GREEN} size={250} />
          </View>
          <View
            style={{
              position: 'absolute',
              height: '100%',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="check" color={COLORS.GREEN} size={150} />
          </View>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            title={'ถัดไป'}
            onPress={() => {
              navigation.navigate('OnboardComplete')
            }}
          />
        </View>
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    color: COLORS.PRIMARY_LIGHT,
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
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
