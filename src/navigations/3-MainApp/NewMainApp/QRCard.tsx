import React, { Fragment } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Sizer from 'react-native-size'
import I18n from '../../../../i18n/i18n'
import MainCard from '../../../components/MainCard'
import ReloadButton from '../../../components/ReloadButton'
import { QR_STATE, SelfQR, useSelfQR } from '../../../state/qr'
import { COLORS, FONT_BOLD, FONT_FAMILY, FONT_SIZES } from '../../../styles'
import { QRStateText } from './QRStateText'

const QRCard: React.FC = () => {
  const { qrData, qrState, refreshQR } = useSelfQR()
  const appVersion = DeviceInfo.getVersion()

  // const smallDevice = Dimensions.get('window').height < 600
  // const logoStyle = {
  //   height: smallDevice ? 20 : 30,
  //   width: (smallDevice ? 20 : 30) * (260 / 140),
  // }

  const updateTime = qrData ? `${I18n.t('last_update')} ${qrData.getCreatedDate().format(I18n.t('fully_date'))}` : ''

  return (
    <MainCard>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>My ID</Text>
      </View>
      <View style={styles.updateView}>
        <Text style={styles.textUpdate}>{updateTime}</Text>
        <ReloadButton onClick={refreshQR} />
      </View>

      <View style={styles.cardContent}>
        <QRImage qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />
      </View>
      <View style={styles.cardFooter}>
        {
          // <Image
          //   source={require('./logo-pin-morchana.png')}
          //   resizeMode="contain"
          //   style={logoStyle}
          // />
        }
        {qrData && qrState && <RiskLabel qr={qrData} qrState={qrState} onRefreshQR={refreshQR} />}
        <Text style={styles.textVersionNumber}>V{appVersion}</Text>
      </View>
    </MainCard>
  )
}

const RiskLabel = ({ qr, qrState }: { qr: SelfQR; qrState: QR_STATE; onRefreshQR: any }) => {
  // const color = qr
  //   ? qr.getStatusColor()
  //   : qrState === QR_STATE.NOT_VERIFIED || qrState === QR_STATE.FAILED
  //   ? COLORS.ORANGE_2
  //   : COLORS.GRAY_2
  const label = qr
    ? qr.getLabel()
    : qrState === QR_STATE.NOT_VERIFIED
    ? I18n.t('undetermined_risk')
    : qrState === QR_STATE.LOADING
    ? I18n.t('wait_a_moment')
    : qrState === QR_STATE.FAILED
    ? I18n.t('undetermined_risk')
    : ''
  return (
    <Text
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: 22,
      }}
    >
      {label}
    </Text>
  )
}

const QRImage = ({ qr, qrState, onRefreshQR }: { qr?: SelfQR | null; qrState?: QR_STATE | null; onRefreshQR: any }) => {
  const qrUri = qr?.getQRImageURL()
  return (
    <Sizer style={styles.sizer}>
      {({ height }: any) => {
        const size = height ? Math.min(350, height) : 0
        const qrPadding = Math.min((20 / 300) * size, 10)

        const imageStyle = qr
          ? ({
              resizeMode: 'contain',
              width: size - qrPadding * 2,
              height: size - qrPadding * 2,
              opacity: qrState === QR_STATE.EXPIRE ? 0.05 : 1,
            } as const)
          : ({
              resizeMode: 'contain',
              width: size - qrPadding * 2,
              height: size - qrPadding * 2,
              padding: qrPadding,
            } as const)

        const source = qr ? { uri: qrUri } : require('../../../assets/qr-placeholder.png')

        return size ? (
          <Fragment>
            <Image style={imageStyle} source={source} />
            {qrState && <QRStateText qrState={qrState} refreshQR={onRefreshQR} />}
          </Fragment>
        ) : (
          <ActivityIndicator size='large' />
        )
      }}
    </Sizer>
  )
}

const styles = StyleSheet.create({
  cardHeader: {
    borderTopEndRadius: 14,
    borderTopStartRadius: 14,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E4E87',
  },
  cardHeaderText: {
    width: '100%',
    color: 'white',
    textAlign: 'center',
    fontSize: FONT_SIZES[600],
    fontFamily: FONT_BOLD,
  },
  cardFooter: {
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVersion: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[600] * 0.85,
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
  textVersionNumber: {
    color: '#222222',
    fontSize: FONT_SIZES[600] * 0.85,
    fontFamily: FONT_FAMILY,
  },
  sizer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GRAY_1,
    borderStyle: 'solid',
    maxHeight: 350,
  },
  cardContent: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  updateView: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textUpdate: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    marginRight: 5,
    color: '#222222',
  },
})
export default QRCard
