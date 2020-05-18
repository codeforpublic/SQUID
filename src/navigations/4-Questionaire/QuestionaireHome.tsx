import React, { useEffect } from 'react'
import styled from '@emotion/native'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native'
import { FONT_FAMILY, COLORS, FONT_BOLD, FONT_SIZES } from '../../styles'
import { Button, normalize } from 'react-native-elements'
import { useSafeArea } from 'react-native-safe-area-view'
import { PrimaryButton } from '../../components/Button'

import I18n from '../../../i18n/i18n';

const Container = styled(View)({
  backgroundColor: '#00A0D7',
  justifyContent: 'center',
  flex: 1,
})
const Content = styled(View)({
  padding: normalize(20),
  backgroundColor: 'white',
  borderRadius: 20,
})

const HomeListItem = ({ source, title, subtitle }) => {
  const isLarge = Dimensions.get('window').height >= 800
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: isLarge ? 16 : 8,
      }}
    >
      <Image source={source} style={{ marginRight: 30 }} />
      <View>
        <Text style={{ fontFamily: FONT_BOLD, fontSize: FONT_SIZES[600] }}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZES[500],
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
  const largeScreen = Dimensions.get('window').height >= 800
  const doctorSize = largeScreen ? 192 : 140
  const footer = (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: inset.bottom + 16,
        paddingHorizontal: 40,
        marginTop: 16,
      }}
    >
      <HomeListItem
        title={I18n.t('know_status_of_ppl_around_you')}
        subtitle={I18n.t('take_appropriate_action')}
        source={require('./assets/icon_1.png')}
      />
      <HomeListItem
        title={I18n.t('know_the_guideline')}
        subtitle={I18n.t('reduce_covid_spread')}
        source={require('./assets/icon_2.png')}
      />
      <HomeListItem
        title={I18n.t('increase_safety')}
        subtitle={I18n.t('like_having_doctor_with_you')}
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
      <View
        style={{ paddingTop: inset.top, flex: 1, justifyContent: 'flex-end' }}
      >
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Image
            style={{ width: 150, height: 83, marginRight: 0 }}
            resizeMode="contain"
            source={require('./assets/logo_white.png')}
          />
          <Image
            source={require('./assets/doctor.png')}
            style={{
              width: doctorSize,
              height: (doctorSize * 219) / 192,
            }}
          />
        </View>
        <Content
          style={{
            marginHorizontal: fixedFooter ? 16 : 0,
            borderRadius: fixedFooter ? 20 : 0,
          }}
        >
          <Text style={styles.title}>
            {I18n.t('let_dr_chana_check_symptoms')}{largeScreen ? I18n.t('of_you') : ''}
          </Text>
          <Text style={styles.subtitle}>
            {I18n.t('hello_dr_chana_come_to_eval_u')}
            {I18n.t('suggest_guideline')}
            {I18n.t('for_appropriate_level')}
          </Text>
          <PrimaryButton
            containerStyle={{ width: '100%', marginTop: 32 }}
            style={{
              width: '100%',
              backgroundColor: '#216DB8',
            }}
            title={I18n.t('start_eval')}
            onPress={async () => {
              navigation.navigate('QuestionaireForm')
            }}
          />
        </Content>
      </View>
      {fixedFooter ? footer : null}
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[700],
    lineHeight: 28,
    marginBottom: 12,
    alignItems: 'center',
    color: COLORS.PRIMARY_DARK,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600],
    alignItems: 'center',
    color: COLORS.SECONDARY_DIM,
    textAlign: 'left',
  },
})
