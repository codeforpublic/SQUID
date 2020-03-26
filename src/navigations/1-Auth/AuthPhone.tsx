import React, { useState, useMemo } from 'react'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useNavigation } from 'react-navigation-hooks'
import { MyBackground } from '../../covid/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  View,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import { PrimaryButton } from '../../components/Button'
import { Input } from 'react-native-elements'

export const AuthPhone = () => {
  const navigation = useNavigation()
  const [phone, setPhone] = useState('')
  const isValidPhone = useMemo(() => phone.match(/^[0-9]{10}$/), [phone])
  return (
    <MyBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={{ padding: 16 }}>
          <TouchableWithoutFeedback onPress={() => navigation.pop()}>
            <Icon
              name="chevron-thin-left"
              size={24}
              color={COLORS.PRIMARY_LIGHT}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>กรอกเบอร์โทรศัพท์</Text>
          <Text style={styles.subtitle}>เพื่อรับรหัสผ่านจาก SMS</Text>
        </View>
        <View style={styles.content}>
          <Input
            onChangeText={text => setPhone(text)}
            value={phone}
            placeholder="เบอร์โทรศัพท์ของคุณ"
            inputContainerStyle={{
              backgroundColor: COLORS.WHITE,
              borderRadius: 4,
            }}
            maxLength={10}
            keyboardType={'phone-pad'}
            inputStyle={{ textAlign: 'center' }}
            errorMessage={
              phone && !isValidPhone
                ? 'เบอร์โทรศัพท์จะต้องเป็นตัวเลข 10 หลัก'
                : null
            }
          />
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            disabled={!isValidPhone}
            title={'ถัดไป'}
            onPress={() => {
              navigation.navigate({ routeName: 'AuthOTP', params: { phone } })
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
  errorText: {
    color: COLORS.RED,
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
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  agreement: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.PRIMARY_DARK,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
})
