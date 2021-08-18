import React, { useState, useEffect } from 'react'
import { normalize, Input, Text } from 'react-native-elements'
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native'
import I18n from 'i18n-js'
const PRIMARY_COLOR = COLORS.BLUE_BUTTON
const padding = normalize(16)
import { FONT_BOLD, FONT_MED, FONT_SIZES, COLORS } from '../styles'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'
import { PrimaryButton } from './Button'

type CoeCheckingFormPropTypes = {
  formValues?: {
    coeNo: string
    rfNo: string
  }
  isLinked?: boolean
  isFormError: boolean
  onSubmit: any
}

export const CoeCheckingForm = ({ isFormError, onSubmit, formValues, isLinked = false }: CoeCheckingFormPropTypes) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [coeNo, setCoeNo] = useState<string>('')
  const [rfNo, setRfNo] = useState<string>('')
  const [coeNoError, setcoeNoError] = useState<boolean>(false)
  const [rfNoError, setrfNoError] = useState<boolean>(false)
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

  const onFinishForm = async () => {
    try {
      if (!coeNo || !rfNo) {
        setcoeNoError(true)
        setrfNoError(true)
        return
      }
      setIsLoading(true)
      await onSubmit({ coeNo, rfNo })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (formValues) {
      setCoeNo(formValues.coeNo)
      setRfNo(formValues.rfNo)
    }
  }, [formValues])

  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={PRIMARY_COLOR} />
        </View>
      ) : null}
      <View style={styles.contentContainer}>
        <View style={styles.textInputLabel}>
          <Text style={styles.title}>{I18n.t('personal_information')}</Text>
        </View>
        {isFormError ? (
          <View style={styles.textInputLabel}>
            <Text style={{ ...styles.title, color: COLORS.RED_WARNING }}>{I18n.t('coe_checking_error_message')}</Text>
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <Input
            value={coeNo}
            label={
              <InputLabel
                label={I18n.t('coe')}
                onPress={() => navigation.navigate('OnboardCoeEx')}
                requireMark={!isLinked}
                tipButton={!formValues}
              />
            }
            placeholder={I18n.t('coe_ex')}
            onChangeText={(value) => onChangeTextInput('coe', value)}
            inputContainerStyle={styles.textInput}
            disabled={isLinked}
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
              <InputLabel
                label={I18n.t('coe_reference_id')}
                onPress={() => navigation.navigate('OnboardRefIdEx')}
                requireMark={!isLinked}
                tipButton={!formValues}
              />
            }
            placeholder={I18n.t('coe_reference_id_ex')}
            onChangeText={(value) => onChangeTextInput('rf', value)}
            inputContainerStyle={styles.textInput}
            disabled={isLinked}
            errorMessage={rfNoError ? I18n.t('coe_reference_id_error_message') : ''}
          />
        </View>
      </View>
      <View style={styles.footer}>
        {isLinked ? null : (
          <PrimaryButton
            style={styles.fullWidth}
            containerStyle={styles.fullWidth}
            title={I18n.t('save')}
            onPress={onFinishForm}
          />
        )}
      </View>
    </>
  )
}

type InputLabelType = {
  label: string
  onPress?: () => void
  requireMark?: boolean
  tipButton?: boolean
}

const InputLabel = ({ label, onPress, requireMark = true, tipButton = true }: InputLabelType) => {
  return (
    <View style={styles.textInputLabel}>
      {requireMark ? <Text style={styles.requireMark}>*</Text> : null}
      <Text style={styles.inputLabel}>{label}</Text>
      {tipButton ? (
        <TouchableOpacity style={{ paddingHorizontal: 4 }} onPress={onPress}>
          <FeatherIcon name='info' size={16} color='#000' />
        </TouchableOpacity>
      ) : null}
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
  loadingContainer: {
    top: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: '#c9c9c950',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 999,
  },
  contentContainer: {
    flex: 1,
    padding,
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
    paddingHorizontal: 16,
  },
})
