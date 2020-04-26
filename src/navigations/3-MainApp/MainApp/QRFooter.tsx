import React from 'react'
import { FONT_FAMILY, FONT_SIZES, COLORS } from '../../../styles'
import {
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native'
import moment from 'moment-timezone'
import 'moment/locale/th'
import { applicationState } from '../../../state/app-state'

export const QRFooter = () => {  
  const date = moment().locale('th')
  const smallDevice = Dimensions.get('window').height < 600  
  return (
    <View>
      {/* {!isRegistered && (
        <Text style={{
          fontSize: FONT_SIZES[500],
          color: COLORS.BLUE,
          textAlign: 'center'
        }}>ยืนยันตัวตัน</Text>
      )} */}
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
            ตรวจโดยแอปพลิเคชัน
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
            วันที่ {date.format('D MMMM​')} พ.ศ. {date.year() + 543}
          </Text>
        </View>
        <Image
          source={require('../../../assets/logo_header.png')}
          resizeMode="contain"
          style={{
            height: smallDevice ? 30 : 40,
            width: (smallDevice ? 30 : 40) * (260 / 140),
          }}
        />
      </View>
    </View>
  )
}