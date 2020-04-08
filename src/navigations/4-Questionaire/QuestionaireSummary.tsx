import React, { useEffect, useMemo } from 'react'
import { useResetTo } from '../../utils/navigation'
import {
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
  Text,
  Image,
  Dimensions,
} from 'react-native'
import { FONT_FAMILY, COLORS, FONT_SIZES } from '../../styles'
import styled from '@emotion/native'
import { FormHeader } from '../../components/Form/FormHeader'
import { useSafeArea } from 'react-native-safe-area-view'
import { useSelfQR, QR_STATE } from '../../state/qr'
import { WhiteText } from '../../components/Base'
import Icon from 'react-native-vector-icons/Entypo'
import { Button, normalize } from 'react-native-elements'

const Container = styled(View)({
  backgroundColor: '#00A0D7',
  height: '100%',
})

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
`

const Card = styled.View`
  background-color: white;
  border-radius: 16px;
  align-items: center;
  max-width: 360px;
  padding: 16px;
`

const risks = [
  { text: 'ต่ำ', color: COLORS.GREEN },
  { text: 'ปานกลาง', color: COLORS.YELLOW },
  { text: 'สูง', color: COLORS.ORANGE },
  { text: 'สูงมาก', color: COLORS.RED },
]

const RiskLevel = ({ level }) => {
  console.log({ level })
  const indicatorMargin = `${(level - 1) * 25}%`
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          borderRadius: 16,
          height: 32,
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {risks.map(risk => (
          <View
            key={risk.text}
            style={{
              backgroundColor: risk.color,
              flex: 1,
              alignItems: 'center',
            }}
          >
            <WhiteText style={{ fontSize: FONT_SIZES[500] }}>{risk.text}</WhiteText>
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignSelf: 'stretch',
        }}
      >
        <View
          style={{
            marginLeft: indicatorMargin,
            width: '25%',
            alignItems: 'center',
          }}
        >
          <Icon name="triangle-up" color="black" size={24} />
        </View>
      </View>
    </View>
  )
}

export const QuestionaireSummary = ({ navigation }) => {
  const resetTo = useResetTo()
  const inset = useSafeArea()
  const { qrData, qrState, error, refreshQR } = useSelfQR()
  // useEffect(() => {
  //   resetTo({ routeName: 'MainApp' })
  // }, [])
  return (
    <Container>
      <StatusBar backgroundColor="#00A0D7" barStyle="light-content" />
      <FormHeader whiteLogo style={{ paddingTop: inset.top }} />
      {qrState === QR_STATE.LOADING ? (
        <ActivityIndicator />
      ) : (
        <Content>
          <Image
            source={require('./assets/smile-doctor.png')}
            style={{
              width: Math.floor(Dimensions.get('window').width * 0.6),
              height: Math.floor(
                (1578 / 1370) * Dimensions.get('window').width * 0.6,
              ),
            }}
            resizeMode="cover"
          />
          <Card>
            <Text
              style={{
                fontSize: 36,
                fontFamily: FONT_FAMILY,
                color: qrData.getStatusColor(),
              }}
            >
              {qrData.getLabel()}
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES[500],
                fontFamily: FONT_FAMILY,
                color: 'black',
              }}
            >
              หมอจะให้ QR Code
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES[500],
                fontFamily: FONT_FAMILY,
                color: 'black',
              }}
            >
              สำหรับตรวจสอบความเสี่ยง
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES[500],
                marginTop: 8,
                marginBottom: 8,
                fontFamily: FONT_FAMILY,                
                color: '#576675',
              }}
            >
              ระดับความเสี่ยง
            </Text>
            <RiskLevel level={qrData.getLevel()} />
            <View
              style={{
                marginTop: 4,
                alignSelf: 'stretch',
              }}
            >
              <Button
                title={'รับ QR Code'}
                titleStyle={{ fontFamily: FONT_FAMILY }}
                buttonStyle={{
                  height: 46,
                  backgroundColor: '#216DB8',
                  borderRadius: 10,
                  width: '100%',
                }}
                containerStyle={{
                  borderRadius: 10,
                }}
                onPress={async () => {
                  resetTo({ routeName: 'MainApp' })
                }}
              />
            </View>
          </Card>
        </Content>
      )}
    </Container>
  )
}
