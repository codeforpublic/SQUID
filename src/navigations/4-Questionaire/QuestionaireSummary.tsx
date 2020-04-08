import React, { useEffect } from 'react'
import { useResetTo } from '../../utils/navigation'
import { StyleSheet, View, StatusBar, ActivityIndicator } from 'react-native'
import { FONT_FAMILY, COLORS } from '../../styles'
import styled from '@emotion/native'
import { FormHeader } from '../../components/Form/FormHeader'
import { useSafeArea } from 'react-native-safe-area-view'
import { useSelfQR, QR_STATE } from '../../state/qr'

const Container = styled(View)({
  backgroundColor: '#00A0D7',
  height: '100%',
})

const Content = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`

const Card = styled.View`
  background-color: white;
  border-radius: 24px;
  padding: 24px;
`

const DoctorImage = styled.Image`
  width: 60%;
`

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
          <DoctorImage
            source={require('./assets/smile-doctor.png')}
            resizeMode="contain"
          />
          <Card />
        </Content>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  title: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 32,
    alignItems: 'center',
    color: COLORS.PRIMARY_DARK,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_4,
    textAlign: 'left',
  },
})
