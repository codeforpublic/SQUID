import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useNavigation } from 'react-navigation-hooks'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar, View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { PrimaryButton } from '../../components/Button'
import { useResetTo } from '../../utils/navigation'

const STRING = {
  TITLE: 'ลงทะเบียนสำเร็จ',
  SUB_TITLE: 'เริ่มใช้งานได้ทันที',
  NEXT_BUTTON: 'เริ่มใช้งาน',
}

export const OnboardComplete = () => {
  const navigation = useNavigation()
  const resetTo = useResetTo()
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.PRIMARY_DARK}
        barStyle="light-content"
      />      
      <View style={styles.header}>
        <Text style={styles.title}>{STRING.TITLE}</Text>
        <Text style={styles.subtitle}>{STRING.SUB_TITLE}</Text>
      </View>
      <View style={styles.content}>        
          <Icon name="checkcircleo" color={COLORS.GREEN} size={250} />
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={STRING.NEXT_BUTTON}
          onPress={() => {
            resetTo({ routeName: 'MainApp' })
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.PRIMARY_DARK },
  header: {
    alignItems: 'center',
  },

  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.WHITE,
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
    justifyContent: 'center',
    padding: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
