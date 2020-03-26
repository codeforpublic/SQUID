import React from 'react'
import { useNavigationParam } from 'react-navigation-hooks'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import { View, Text, Image } from 'react-native'
import { Title, Header, Subtitle } from '../../components/Base'
import styled from '@emotion/native'
import { FONT_FAMILY, COLORS } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MyBackground } from '../../covid/MyBackground'
import { PrimaryButton } from '../../components/Button'
import moment from 'moment-timezone'
import 'moment/locale/th'

const STATUS_COLORS = {
  green: '#27C269',
  yellow: '#E5DB5C',
  orange: '#E18518',
  red: '#EC3131',
  DEFAULT: '#B4B5C1',
}

const ScoreText = styled(Text)`
  font-weight: 600;
  font-family: ${FONT_FAMILY};
  font-size: 32px;
`
const Content = styled(View)({
  flex: 1,
  alignItems: 'center',
  paddingTop: 40,
})
const Footer = styled(View)({
  alignItems: 'center',
  marginBottom: 16,
})
const DateLabel = styled(Text)({
  fontFamily: FONT_FAMILY,
  marginBottom: 8,
  color: COLORS.GRAY_4
})

export const Score = ({ style, color, score }) => {
  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      <Title style={{ fontSize: 20, marginBottom: -10 }}>คะแนนของคุณ</Title>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <ScoreText style={{ color }}>{score}</ScoreText>
        <ScoreText>/1000</ScoreText>
      </View>
    </View>
  )
}
const SCORES = {
  green: 800,
  orange: 600,
  yellow: 400,
  red: 200,
}

const LABELS = {
  green: 'ความเสี่ยงต่ำ',
  orange: 'ความเสี่ยงปานกลาง',
  yellow: 'ความเสี่ยงสูง',
  red: 'ความเสี่ยงสูงมาก',
}

const RiskLabel = ({ label, color }) => {
  return (
    <View style={{ marginTop: 20, alignItems: 'center' }}>
      <Image source={require('./risk_icon.png')} width={100} height={100} />
      <Subtitle style={{ marginTop: 4 }}>ความเสี่ยง</Subtitle>
      <Title style={{ fontWeight: '600', color }}>{label}</Title>
    </View>
  )
}

export const QRCodeResult = ({ data, onRescan }: { data: QRData, onRescan: (e: any) => any }) => {  
  const { iat, color, age, gender } = data
  console.log('QRCodeResult iat', iat)
  const createdAt = moment(iat * 1000)
    .locale('th')    
    
  console.log('createdAt', createdAt)

  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <Title>ผลลัพธ์การแสกน</Title>
        </Header>
        <Content>
          <CircularProgressAvatar
            text="เสี่ยงน้อย"
            CustomComponent={({ style }) => (
              <Score
                style={style}
                color={STATUS_COLORS[color]}
                score={SCORES[color]}
              />
            )}
            color={STATUS_COLORS[color]}
            progress={80}
          />
          <RiskLabel label={LABELS[color]} color={STATUS_COLORS[color]} />
        </Content>
        <Footer>
          {createdAt? <DateLabel>ข้อมูลวันที่ {createdAt.format('DD MMM YYYY HH:mm น.')}</DateLabel>: void 0}
          <PrimaryButton title={'สแกนใหม่อีกครั้ง'} onPress={onRescan} />
        </Footer>
      </SafeAreaView>
    </MyBackground>
  )
}
