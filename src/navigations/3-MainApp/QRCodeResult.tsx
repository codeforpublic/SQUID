import React from 'react'
import { useNavigationParam } from 'react-navigation-hooks'
import { CircularProgressAvatar } from '../../components/CircularProgressAvatar'
import { View, Text, Image, Dimensions } from 'react-native'
import { Title, Header, Subtitle } from '../../components/Base'
import styled from '@emotion/native'
import { FONT_FAMILY, COLORS, FONT_SIZES } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MyBackground } from '../../components/MyBackground'
import { PrimaryButton } from '../../components/Button'
import moment from 'moment-timezone'
import 'moment/locale/th'
import { QRResult } from '../../state/qr'

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
  color: COLORS.GRAY_4,
})

const RiskLabel = ({ label, color, style }) => {
  return (
    <View
      style={{
        ...style,
        marginTop: -10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image source={require('./risk_icon.png')} width={100} height={100} />
      <Subtitle style={{ marginTop: 4 }}>ความเสี่ยง</Subtitle>
      <Title
        style={{
          fontWeight: '600',
          color,
          fontSize: FONT_SIZES[700],
          lineHeight: 36,
        }}
      >
        {label}
      </Title>
    </View>
  )
}

export const QRCodeResult = ({
  qrResult,
  onRescan,
}: {
  qrResult: QRResult
  onRescan: (e: any) => any
}) => {
  // console.log('qrResult', qrResult)
  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <Title>ผลลัพธ์การสแกน</Title>
        </Header>
        <Content>
          <CircularProgressAvatar
            text="เสี่ยงน้อย"
            CustomComponent={({ style }) => (
              <RiskLabel
                style={style}
                label={qrResult.getLabel()}
                color={qrResult.getStatusColor()}
              />
            )}
            color={qrResult.getStatusColor()}
            progress={80}
            width={Math.floor((70 / 100) * Dimensions.get('screen').width)}
          />
        </Content>
        <Footer>
          <DateLabel>
            ข้อมูลวันที่ {qrResult.getCreatedDate().format('D MMMM​')} พ.ศ.{' '}
            {qrResult.getCreatedDate().year() + 543}
            {qrResult.getCreatedDate().format(' HH:mm น.')}
          </DateLabel>
          <PrimaryButton title={'สแกนใหม่อีกครั้ง'} onPress={onRescan} />
        </Footer>
      </SafeAreaView>
    </MyBackground>
  )
}
