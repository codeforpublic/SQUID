import React from 'react'
import { FONT_FAMILY, FONT_SIZES, COLORS } from '../../../styles'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import moment from 'moment-timezone'
import 'moment/locale/th'
import { Link } from '../../../components/Base'
import { useNavigation } from '@react-navigation/native'
import { userPrivateData } from '../../../state/userPrivateData'

import I18n from '../../../../i18n/i18n'

export const QRFooter = () => {
  const isRegistered = Boolean(userPrivateData.getData('authToken'))
  const navigation = useNavigation()
  const date = moment().locale(I18n.currentLocale())
  const smallDevice = Dimensions.get('window').height < 600

  return (
    <View>
      {!isRegistered && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AuthPhone', {
              onBack: () => {
                navigation.pop()
              },
              backIcon: 'close',
            })
          }
        >
          <Link
            style={{
              fontSize: FONT_SIZES[500],
              color: '#576675',
              textDecorationLine: 'underline',
            }}
          >
            {I18n.t('verify_iden_here')}
          </Link>
        </TouchableOpacity>
      )}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ marginRight: 12 }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: FONT_SIZES[500],
              textAlign: 'right',
            }}
          >
            {I18n.t('check_by_app')}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: FONT_SIZES[500],
              color: '#02A0D7',
              opacity: 0.9,
              textAlign: 'right',
            }}
          >
            {date.format('D MMMM​')} {date.year() + (I18n.currentLocale() == 'th' ? 543 : 0)}
          </Text>
        </View>
        <Image
          source={require('../../../assets/logo_header.png')}
          resizeMode='contain'
          style={{
            height: smallDevice ? 30 : 40,
            width: (smallDevice ? 30 : 40) * (260 / 140),
          }}
        />
      </View>
    </View>
  )
}
