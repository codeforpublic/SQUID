import React, { useEffect } from 'react'
import styled from '@emotion/native'
import { View, StyleSheet, Text, Image, Dimensions, StatusBar } from 'react-native'
import { FONT_FAMILY, COLORS, FONT_BY_WEIGHT } from '../../styles'
import { Button } from 'react-native-elements'
import { useSafeArea } from 'react-native-safe-area-view'

const Container = styled(View)({
  backgroundColor: '#00A0D7',
  justifyContent: 'center',
  flex: 1,
})
const Content = styled(View)({
  paddingHorizontal: 20,  
  padding: 24,
  backgroundColor: 'white',
  borderRadius: 20,
})

const HomeListItem = ({ source, title, subtitle }) => {
  const isLarge = Dimensions.get('window').height >= 800
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: isLarge? 16: 8 }}>
      <Image source={source} style={{ marginRight: 30 }} />
      <View>
        <Text
          style={{ fontFamily: FONT_BY_WEIGHT.BOLD, fontSize: 20 }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            color: COLORS.GRAY_2,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  )
}

export const QuestionaireHome = ({ navigation }) => {
  const inset = useSafeArea()
  const fixedFooter = Dimensions.get('window').height >= 667
  const doctorSize = Dimensions.get('window').height >= 800? 192: 140
  const footer = (
    <View style={{ backgroundColor: 'white', paddingBottom: inset.bottom + 16, paddingHorizontal: 40, marginTop: 16 }}>
      <HomeListItem
        title="รู้สถานะคนใกล้ชิด"
        subtitle="ระวังและปฏิบัติตัวได้เหมาะสม"
        source={require('./assets/icon_1.png')}
      />
      <HomeListItem
        title="ทราบข้อควรปฏิบัติ"
        subtitle="เพื่อลดความเสี่ยงในการแพร่เชื้อ"
        source={require('./assets/icon_2.png')}
      />
      <HomeListItem
        title="เพิ่มความปลอดภัย"
        subtitle="เหมือนมีหมออยู่ใกล้คุณ"
        source={require('./assets/icon_3.png')}
      />
    </View>
  )
  return (
    <Container>
      <StatusBar
        backgroundColor={COLORS.PRIMARY_DARK}
        barStyle="light-content"
      />
      <View style={{ paddingTop: inset.top, flex: 1, justifyContent: 'flex-end', }}>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
        >
          <Image
            style={{ width: 150, height: 83, marginRight: 0 }}
            resizeMode="contain"
            source={require('./assets/logo_white.png')}
          />
          <Image source={require('./assets/doctor.png')} style={{
            width: doctorSize,
            height: doctorSize * 219 / 192
          }} />
        </View>
        <Content style={{ marginHorizontal: fixedFooter? 16: 0 }}>
          <Text style={styles.title}>หมอชนะแวะมาสอบถาม อาการของคุณ</Text>
          <Text style={styles.subtitle}>
            สวัสดีครับ วันนี้หมอแวะมาประเมินอาการของคุณ
            หมอจะแนะนำวิธีปฏิบัติตัวของคุณ
            ให้เหมาะสมกับความเสี่ยงที่หมอประเมินได้
          </Text>
          <Button
            containerStyle={{ width: '100%', marginTop: 32 }}
            buttonStyle={{
              height: 46,
              backgroundColor: '#216DB8',
              borderRadius: 10,
            }}
            titleStyle={{ fontFamily: FONT_FAMILY }}
            title={'เริ่มประเมิน'}
            onPress={async () => {
              navigation.navigate('QuestionaireForm')
            }}
          />
        </Content>
      </View>
      {fixedFooter? footer: null}
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  title: {
    fontFamily: FONT_BY_WEIGHT.BOLD,
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 12,
    alignItems: 'center',
    color: COLORS.PRIMARY_DARK,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'left',
  },
})
