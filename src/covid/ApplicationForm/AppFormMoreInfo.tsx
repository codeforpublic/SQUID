import { useMutation } from '@apollo/react-hooks'
import { Formik } from 'formik'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Alert, StyleSheet, Text, View, findNodeHandle } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { CheckBox, Divider, Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import RNPickerSelect from 'react-native-picker-select'
import { NavigationActions, StackActions } from 'react-navigation'

import { useHUD } from '../../HudView'
import {
  ApplicationMutation,
  useApplication,
} from '../../common/state/application.state'
import { UserInfoMutation, useUserInfo } from '../../common/state/user.state'
import { COLORS, FONT_FAMILY } from '../../styles'
import { DangerButton, PrimaryButton } from '../Button'
import { DEFAULT_APPLICATION_ID } from '../const'
import { MyBackground } from '../MyBackground'
import { useSafeArea } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-community/async-storage'
import { useInputSchema } from '../../common/form/schema'
import { dataInputTable } from '../../common/form/data-input'
import { COUNTRIES, RISK_COUNTRY } from '../../common/form/const'
import moment from 'moment'
import { useNavigation } from 'react-navigation-hooks'

const MyRadioButton = ({ value, choices, onValueChange }) => {
  const [choice, setChoice] = useState(value)
  return (
    <View style={{ flexDirection: 'row', marginLeft: -10 }}>
      {choices.map(c => (
        <CheckBox
          key={c.value}
          title={c.title}
          checked={value === c.value}
          onPress={() => {
            onValueChange(c.value)
          }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          textStyle={styles.input}
          containerStyle={{
            height: 40,
            backgroundColor: 'transparent',
            borderWidth: 0,
            margin: 0,
            padding: 0,
            minWidth: 100,
          }}
        />
      ))}
    </View>
  )
}

const NationalityPicker = ({ value, onValueChange }) => {
  const items = COUNTRIES.map(c => {
    return {
      label: c.name,
      value: c.alpha2,
      color: 'black',
    }
  })
  return (
    <View
      style={{
        height: 40,
        backgroundColor: '#F9FBFD',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 6,
        justifyContent: 'center',
        marginBottom: 14,
        paddingHorizontal: 10,
      }}
    >
      <RNPickerSelect
        onValueChange={value => {
          if (value) {
            onValueChange(value)
          } else {
            onValueChange('')
          }
        }}
        style={{
          inputIOS: {
            backgroundColor: 'red',
            color: 'red',
          },
        }}
        items={items}
        value={value}
        style={{
          inputAndroid: [styles.input, { color: 'black' }],
          inputIOS: styles.input,
        }}
        placeholder={{ label: 'กรุณาระบุสัญชาติ', value: null }}
      />
    </View>
  )
}

const RiskCountryPicker = ({ value, onValueChange }) => {
  const items = RISK_COUNTRY.map(v => {
    return {
      label: v,
      value: v,
    }
  })
  return (
    <View
      style={{
        height: 40,
        backgroundColor: '#F9FBFD',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 6,
        justifyContent: 'center',
        marginBottom: 14,
        paddingHorizontal: 10,
      }}
    >
      <RNPickerSelect
        pickerProps={{
          style: {
            backgroundColor: COLORS.GRAY_1,
          },
        }}
        onValueChange={value => {
          if (value) {
            onValueChange(value)
          } else {
            onValueChange('')
          }
        }}
        items={items}
        style={{
          inputAndroid: [styles.input, { color: 'black' }],
          inputIOS: styles.input,
        }}
        value={value}
        placeholder={{ label: 'กรุณาระบุประเทศ', value: null }}
      />
    </View>
  )
}

const permissionGroupMapping = {
  demographic: 'ข้อมูลพื้นฐาน',
  id: 'ติดต่อ',
  covid: 'อาการป่วย',
  travel: 'การเดินทาง',
  community: 'โอกาสติดเชื้อ',
}

interface CampaignDataInputFormProps {
  application?: Application
  dataInputs: DataInput[]
  userInfo: any
  onComplete?: Function
  onCancel?: Function
  permissions: Permission[]
  onValidationError?: Function
}

const ValidationErrorHandler = ({ isSubmitting, error, onError }) => {
  useEffect(() => {
    if (error && isSubmitting) {
      onError(error)
    }
  }, [error, isSubmitting])
  return null
}

export const CampaignDataInputForm = ({
  application,
  dataInputs,
  userInfo,
  onComplete,
  onCancel,
  permissions,
  onValidationError,
}: CampaignDataInputFormProps) => {
  const { showSpinner, hide } = useHUD()
  const [deleteApplication] = useMutation(ApplicationMutation.deleteApplication)
  const [syncUserData] = useMutation(UserInfoMutation.syncUserData)
  let currentPermissionGroup = ''
  const InputSchema = useInputSchema(dataInputs)
  const formRef = useRef({})

  const initialValue = dataInputs.reduce((map, obj) => {
    map[obj.id] = userInfo[obj.id] || obj.defaultValue
    return map
  }, {} as any)
  const handleCancel = async () => {
    showSpinner()
    if (application?.id === DEFAULT_APPLICATION_ID) {
      await AsyncStorage.setItem(
        'optOutCampaign',
        JSON.stringify({ timestamp: Date.now() }),
      )
    }
    hide()
    if (onCancel) {
      onCancel()
    }
  }
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={InputSchema}
      onSubmit={async values => {
        try {
          showSpinner()
          const data = await InputSchema.validate(values)
          await syncUserData({
            variables: {
              data,
            },
          })
          hide()
          if (onComplete) {
            onComplete()
          }
        } catch (err) {
          console.error('error', err)
          hide()
          Alert.alert('แชร์ข้อมูลไม่สำเร็จ')
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => {
        return (
          <View>
            {dataInputs.map((di, i) => {
              if (di.showCondition && !di.showCondition(values)) {
                return null
              }
              const permissionGroup = di.name?.split(':')[1]
              let isNewPermissionGroup = false
              if (currentPermissionGroup !== permissionGroup) {
                currentPermissionGroup = permissionGroup
                isNewPermissionGroup = true
              }
              const isFirstError =
                errors[di.id] && Object.keys(errors)[0] === di.id
              const ref = formRef.current[di.id]
              return (
                <>
                  {onValidationError && isFirstError && (
                    <ValidationErrorHandler
                      isSubmitting={isSubmitting}
                      onError={error => {
                        onValidationError(error, ref)
                      }}
                      error={errors[di.id]}
                    />
                  )}
                  {isNewPermissionGroup && (
                    <View
                      style={{
                        marginTop: 10,
                      }}
                    >
                      {i !== 0 && <Divider />}
                      <Text style={styles.permissionGroupTitle}>
                        {permissionGroupMapping[permissionGroup]}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      paddingHorizontal: 30,
                    }}
                    ref={r => {
                      formRef.current[di.id] = r
                    }}
                  >
                    <View>
                      <Text style={styles.inputTitle}>
                        {di.titleTH}{' '}
                        {errors[di.id] && touched[di.id] ? (
                          <Text
                            style={{
                              color: COLORS.RED,
                              fontSize: 12,
                              fontWeight: '300',
                              marginBottom: 8,
                            }}
                          >
                            [{errors[di.id]}]
                          </Text>
                        ) : null}
                      </Text>
                    </View>
                    {di.inputType === 'M/F' ? (
                      <MyRadioButton
                        value={values[di.id]}
                        onValueChange={handleChange(di.id)}
                        choices={[
                          {
                            title: 'ชาย',
                            value: 'M',
                          },
                          { title: 'หญิง', value: 'F' },
                        ]}
                      />
                    ) : di.inputType.includes('/') ? (
                      <MyRadioButton
                        value={values[di.id]}
                        onValueChange={handleChange(di.id)}
                        choices={[
                          {
                            title: di.inputType.split('/')[0],
                            value: 'true',
                          },
                          { title: di.inputType.split('/')[1], value: 'false' },
                        ]}
                      />
                    ) : di.inputType === 'Date' ? (
                      <DatePicker
                        mode="date"
                        androidMode="spinner"
                        key={di.id}
                        date={values[di.id]}
                        placeholder="กรุณาระบุวันที่"
                        format="YYYY-MM-DD"
                        onDateChange={handleChange(di.id)}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        style={{
                          marginTop: 10,
                          marginLeft: 10,
                          width: '100%',
                        }}
                        customStyles={{
                          dateText: [styles.input, { width: '100%' }],
                          placeholderText: [styles.input, { width: '100%' }],
                          datePicker: {
                            backgroundColor: COLORS.GRAY_1,
                            color: COLORS.BLACK_1,
                          },
                          dateInput: {
                            ...styles.inputContainer,
                          },
                        }}
                        maxDate={moment().format('YYYY-MM-DD')}
                        locale="th-Th"
                        iconComponent={
                          <View style={{ marginLeft: 20, marginTop: -10 }}>
                            <Icon
                              name={'calendar'}
                              type={'antdesign'}
                              color="#787A7D"
                              size={24}
                            />
                          </View>
                        }
                      />
                    ) : di.inputType === 'Select <Nationality>' ? (
                      <NationalityPicker
                        value={values[di.id]}
                        onValueChange={handleChange(di.id)}
                      />
                    ) : di.inputType === 'Select <Country>' ? (
                      <RiskCountryPicker
                        value={values[di.id]}
                        onValueChange={handleChange(di.id)}
                      />
                    ) : (
                      <Input
                        key={di.id}
                        onChangeText={handleChange(di.id)}
                        onBlur={handleBlur(di.id)}
                        value={values[di.id]}
                        placeholder={di.titleTH}
                        labelStyle={styles.inputLabel}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                      />
                    )}
                  </View>
                </>
              )
            })}
            <View style={{ marginHorizontal: 30 }}>
              <PrimaryButton
                title={application ? 'ส่งข้อมูล' : 'แก้ไข'}
                style={{ marginTop: 56, alignSelf: 'center', width: '100%' }}
                onPress={handleSubmit}
              />
              {application && (
                <DangerButton
                  title="ไม่อนุญาต"
                  style={{ marginTop: 10, alignSelf: 'center', width: '100%' }}
                  onPress={handleCancel}
                />
              )}
            </View>
          </View>
        )
      }}
    </Formik>
  )
}

export const AppFormMoreInfo = () => {
  const navigation = useNavigation<{
    params: {
      applicationId: string
      permissions?: Permission[]
    }
  }>()
  const [application] = useApplication(navigation.state.params.applicationId)
  const permissions = navigation.state.params?.permissions
  const dataInputs = useMemo(() => {
    return dataInputTable.filter(di => {
      if (!permissions || permissions.length === 0) {
        return true
      }
      return permissions.some(permission => {
        if (permission === 'data:*') {
          return true
        }
        return di.name.includes(permission)
      })
    })
  }, [permissions, dataInputTable])
  const [userInfo, loading] = useUserInfo()
  const insets = useSafeArea()
  const scrollRef = useRef(null)
  const onValidationError = (err, ref) => {
    const scrollView = scrollRef.current
    requestAnimationFrame(() => {
      ref.measureLayout(findNodeHandle(scrollView), (x, y) => {
        scrollView.scrollTo({ x: 0, y: y, animated: true })
      })
    })
  }

  if (loading || !userInfo) {
    return null
  }

  return (
    <MyBackground variant="light">
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <KeyboardAwareScrollView
          style={{ flexGrow: 1, paddingTop: 20 }}
          ref={scrollRef}
        >
          <View
            style={{
              paddingHorizontal: 30,
            }}
          >
            <Text style={styles.title}>ข้อมูลเพิ่มเติมที่ต้องการ</Text>
            <Text style={styles.description}>
              ข้อมูลด้านล่างนี้เป้นข้อมูลที่โครงการขอเพื่อนำไปประมวลผลเพื่อประโยชน์ต่อไป
              กรุณาตรวจทาน และตัดสินใจการให้ข้อมูลก่อนกด ส่งข้อมูล
            </Text>
          </View>
          <CampaignDataInputForm
            application={application}
            dataInputs={dataInputs}
            userInfo={userInfo?.data}
            onValidationError={onValidationError}
            onComplete={() => {
              Alert.alert(
                'แชร์ข้อมูล',
                `ข้อมูลของคุณได้ถูกแชร์ไปยัง ${application?.displayName} แล้ว`,
              )
              let action = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'MainTab',
                  }),
                ],
                key: null,
              })
              navigation.dispatch(action)
            }}
            onCancel={() => {
              Alert.alert(
                'ปฏิเสธการแชร์ข้อมูล',
                `คุณได้ปฏิเสธการแชร์ข้อมูลเพิ่มเติมแล้ว`,
              )
              let action = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'MainTab',
                  }),
                ],
                key: null,
              })
              navigation.dispatch(action)
            }}
          />

          <Text style={styles.bottomText}>ส่งข้อมูลไปยังโครงการ</Text>
        </KeyboardAwareScrollView>
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 29,
    lineHeight: 44,
    color: COLORS.PRIMARY_DARK,
  },
  description: {
    marginTop: 18,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.PRIMARY_DARK,
    marginBottom: 0,
  },
  inputTitle: {
    marginBottom: 5,
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: '#787A7D',
  },
  inputContainer: {
    marginHorizontal: -10,
    marginBottom: 14,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#F9FBFD',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
  },
  inputLabel: { fontFamily: FONT_FAMILY, fontSize: 14 },
  input: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: 'normal' },
  bottomText: {
    marginTop: 40,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'left',
    alignSelf: 'center',
    color: COLORS.PRIMARY_DARK,
    marginBottom: 30,
  },
  permissionGroupTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: '500',
    color: '#3A4DE4',
    marginTop: 20,
    marginBottom: 25,
    marginLeft: 30,
  },
})
