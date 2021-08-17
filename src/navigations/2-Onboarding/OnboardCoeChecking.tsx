import I18n from 'i18n-js'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { normalize, Input } from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/FontAwesome'
import { PrimaryButton } from '../../components/Button'
import { FONT_BOLD, FONT_MED, FONT_SIZES, COLORS } from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { coeChecking } from '../../services/coe-checking'
import { PageBackButton } from './OnboardEnterQuestion'

const padding = normalize(16)
const PRIMARY_COLOR = COLORS.BLUE_BUTTON

export const OnboardCoeChecking = () => {
  const [coeNo, setCoeNo] = useState<string>('')
  const [rfNo, setRfNo] = useState<string>('')
  const [coeNoError, setcoeNoError] = useState<boolean>(false)
  const [rfNoError, setrfNoError] = useState<boolean>(false)
  const [coeCheckingResultError, setCoeCheckingResultError] = useState<boolean>(false)
  const navigation = useNavigation()

  const onChangeTextInput = (type: 'coe' | 'rf', value: string) => {
    if (type === 'coe') {
      setCoeNo(value)
      setcoeNoError(!value)
    } else {
      setRfNo(value)
      setrfNoError(!value)
    }
  }

  const onSubmit = async () => {
    try {
      if (!coeNo || !rfNo) {
        setcoeNoError(true)
        setrfNoError(true)
        return
      }
      const result = await coeChecking({ coeNo, rfNo })
      if (result) {
        // navigation.navigate('MainApp')
      } else {
        setCoeCheckingResultError(true)
      }
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <PageBackButton label={I18n.t('research')} />
      <View style={styles.contentContainer}>
        <View style={styles.textInputLabel}>
          <Text style={styles.title}>{I18n.t('personal_information')}</Text>
        </View>
        {coeCheckingResultError ? (
          <View style={styles.textInputLabel}>
            <Text style={{ ...styles.title, color: COLORS.RED_WARNING }}>{I18n.t('coe_checking_error_message')}</Text>
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <Input
            value={coeNo}
            label={<InputLabel label={I18n.t('coe')} onPress={() => navigation.navigate('OnboardCoeEx')} />}
            placeholder={I18n.t('coe_ex')}
            onChangeText={(value) => onChangeTextInput('coe', value)}
            inputContainerStyle={styles.textInput}
            errorMessage={coeNoError ? I18n.t('coe_error_message') : ''}
            rightIcon={
              <TouchableOpacity
                style={{ paddingHorizontal: padding }}
                onPress={() => navigation.navigate('OnboardQrScanner')}
              >
                <Icon name='qrcode' size={24} color='#000' />
              </TouchableOpacity>
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            value={rfNo}
            label={
              <InputLabel label={I18n.t('coe_reference_id')} onPress={() => navigation.navigate('OnboardRefIdEx')} />
            }
            placeholder={I18n.t('coe_reference_id_ex')}
            onChangeText={(value) => onChangeTextInput('rf', value)}
            inputContainerStyle={styles.textInput}
            errorMessage={rfNoError ? I18n.t('coe_reference_id_error_message') : ''}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={styles.fullWidth}
          containerStyle={styles.fullWidth}
          title={I18n.t('save')}
          onPress={onSubmit}
        />
      </View>
    </View>
  )
}

type InputLabelType = {
  label: string
  onPress?: () => void
}

const InputLabel = ({ label, onPress }: InputLabelType) => {
  return (
    <View style={styles.textInputLabel}>
      <Text style={styles.requireMark}>*</Text>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={{ paddingHorizontal: 4 }} onPress={onPress}>
        <FeatherIcon name='info' size={16} color='#000' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  requireMark: {
    color: COLORS.RED,
    paddingRight: 4,
  },
  flexRow: {
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  container: {
    backgroundColor: '#fff',
    padding,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingTop: padding,
  },
  inputContainer: {
    marginVertical: 16,
  },
  inputLabel: {
    color: COLORS.BLACK_2,
  },
  textInput: {
    borderColor: COLORS.GRAY_6,
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    fontFamily: FONT_MED,
    fontSize: FONT_SIZES[600],
  },
  textInputLabel: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  title: {
    color: PRIMARY_COLOR,
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
  },
  footer: {
    alignItems: 'center',
    marginBottom: 12,
  },
})
