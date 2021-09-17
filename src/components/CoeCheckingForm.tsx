import React, { useState, useEffect } from 'react'
import { normalize, Input, Text } from 'react-native-elements'
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Modal } from 'react-native'
import I18n from 'i18n-js'
const PRIMARY_COLOR = COLORS.BLUE_BUTTON
const padding = normalize(16)
import { FONT_BOLD, FONT_MED, FONT_SIZES, COLORS } from '../styles'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { PrimaryButton } from './Button'
import { Button } from 'react-native-elements'

type CoeCheckingFormPropTypes = {
  formValues?: {
    coeNo: string
    rfNo: string
  }
  isLinked?: boolean
  isFormError: boolean
  onSubmit: any
  setIsFormError: any
}

export const CoeCheckingForm = ({
  isFormError,
  onSubmit,
  formValues,
  isLinked,
  setIsFormError = false,
}: CoeCheckingFormPropTypes) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [coeNo, setCoeNo] = useState<string>('')
  const [rfNo, setRfNo] = useState<string>('')
  const [coeNoError, setCoeNoError] = useState<boolean>(false)
  const [rfNoError, setRfNoError] = useState<boolean>(false)
  const navigation = useNavigation()
  const [modalValue, setModalValue] = useState<boolean>(false)

  const numberRegex = new RegExp(/^\d{6}$/)

  const onChangeTextInput = (type: 'coe' | 'rf', value: string) => {
    if (type === 'rf') {
      const validateResult = numberRegex.test(value)
      setRfNo(value)
      setRfNoError(!validateResult)
      return
    }
    setCoeNo(value)
    setCoeNoError(!value)
  }
  const onCloseModal = () => {
    setModalValue(false)
    setIsFormError(false)
  }

  const onFinishForm = async () => {
    try {
      if (!coeNo || !rfNo) {
        if (!coeNo) {
          setCoeNoError(true)
        }
        if (!rfNo) {
          setRfNoError(true)
        }
        return
      }
      setIsLoading(true)
      await onSubmit({ coeNo, rfNo })
    } catch (error) {
      setModalValue(true)
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

  useEffect(() => {
    setModalValue(isFormError)
  }, [isFormError])

  useEffect(() => {}, [modalValue])

  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={PRIMARY_COLOR} />
        </View>
      ) : null}
      <View style={styles.contentContainer}>
        <View style={styles.textInputLabel}>
          <Text style={styles.title}>{I18n.t('personal_information_low_i')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            value={coeNo}
            label={
              <InputLabel
                label={I18n.t('coe')}
                onPress={() => navigation.navigate('OnboardCoeEx')}
                requireMark={!isLinked}
                tipButton={!isLinked}
              />
            }
            placeholder={I18n.t('coe_ex')}
            inputStyle={{ fontFamily: FONT_MED, fontSize: FONT_SIZES[600] }}
            onChangeText={(value) => onChangeTextInput('coe', value)}
            inputContainerStyle={{ ...styles.textInput, borderColor: coeNoError ? COLORS.DANGER : COLORS.GRAY_6 }}
            disabled={isLinked}
            errorMessage={coeNoError ? I18n.t('coe_error_message') : ''}
            errorStyle={{ fontFamily: FONT_MED, fontSize: FONT_SIZES[500] }}
            rightIcon={
              isLinked ? (
                <View />
              ) : (
                // <TouchableOpacity
                //   style={{ paddingHorizontal: padding }}
                //   onPress={() => navigation.navigate('OnboardQrScanner')}
                // >
                //   <Icon name='qrcode' size={24} color='#000' />
                // </TouchableOpacity>
                <View />
              )
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            value={rfNo}
            keyboardType='number-pad'
            label={
              <InputLabel
                label={I18n.t('coe_reference_id')}
                onPress={() => navigation.navigate('OnboardRefIdEx')}
                requireMark={!isLinked}
                tipButton={!isLinked}
              />
            }
            placeholder={I18n.t('coe_reference_id_ex')}
            inputStyle={{ fontFamily: FONT_MED, fontSize: FONT_SIZES[600] }}
            onChangeText={(value) => onChangeTextInput('rf', value)}
            inputContainerStyle={{ ...styles.textInput, borderColor: rfNoError ? COLORS.DANGER : COLORS.GRAY_6 }}
            disabled={isLinked}
            errorMessage={rfNoError ? I18n.t('coe_reference_id_error_message') : ''}
            errorStyle={{ fontFamily: FONT_MED, fontSize: FONT_SIZES[500] }}
          />
        </View>
      </View>
      <View style={styles.footer}>
        {isLinked ? null : (
          <PrimaryButton
            style={styles.primaryButton}
            containerStyle={styles.fullWidth}
            title={I18n.t('save')}
            onPress={onFinishForm}
          />
        )}
      </View>
      <Modal onDismiss={() => setModalValue(false)} visible={modalValue} transparent>
        <View style={styles.modalStyle}>
          <View style={styles.modalContainer}>
            <View style={{ alignItems: 'center', paddingTop: 32, paddingHorizontal: 32 }}>
              <FeatherIcon name='alert-circle' size={48} color={COLORS.RED_WARNING} />
              <Text style={{ fontSize: FONT_SIZES[600], color: COLORS.RED_WARNING, fontFamily: FONT_BOLD }}>
                {I18n.t('coe_alert_title_error')}
              </Text>
              <Text style={{ textAlign: 'center', marginTop: 24, fontSize: FONT_SIZES[500], fontFamily: FONT_MED }}>
                {I18n.t('coe_alert_text_error')}
              </Text>
            </View>
            <View style={{ bottom: 32, left: 0, right: 0, position: 'absolute' }}>
              <Button
                type='outline'
                titleStyle={{ color: COLORS.DARK_BLUE, fontFamily: FONT_MED, fontSize: FONT_SIZES[500] }}
                title={I18n.t('close')}
                buttonStyle={{ width: 80, borderColor: COLORS.DARK_BLUE }}
                containerStyle={{ alignItems: 'center' }}
                onPress={() => onCloseModal()}
              />
            </View>
          </View>
        </View>
      </Modal>
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
          <FeatherIcon name='info' size={16} color={COLORS.DARK_BLUE} />
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
    borderWidth: 1,
    borderRadius: 5,
  },
  primaryButton: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.DARK_BLUE,
    backgroundColor: COLORS.DARK_BLUE,
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
  modalStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    borderColor: COLORS.GRAY_3,
    borderWidth: 1,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width - 64,
    height: Dimensions.get('window').height / 2,
  },
})
