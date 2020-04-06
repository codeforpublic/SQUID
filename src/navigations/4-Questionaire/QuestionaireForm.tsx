import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/native'
import { useSafeArea } from 'react-native-safe-area-context'
import { QuestionaireSelect } from '../../components/QuestionaireSelect'
import { View, Text, StatusBar, StyleSheet, Dimensions } from 'react-native'
import { COLORS, FONT_FAMILY } from '../../styles'
import { FormHeader } from '../../components/Form/FormHeader'
import { dataInputTable } from './form-input'
import { useIsFocused } from 'react-navigation-hooks'
import { updateUserData } from '../../api'
import { useHUD } from '../../HudView'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import { applicationState } from '../../state/app-state'

const Container = styled(View)({
  backgroundColor: '#E3F4FF',
  height: '100%',
})
const Footer = styled(View)({
  alignItems: 'center',
  marginVertical: 12,
  paddingHorizontal: 20
})

export const FormDataInput = ({
  di,
  value,
  setValue,
}: {
  di: DataInput
  setValue: (value: any) => void
  value: any
}) => {
  if (di.inputType === 'MuliSelect') {
    return (
      <QuestionaireSelect
        options={di.options}
        multiple
        value={value}
        defaultValue={di.defaultValue}
        onChange={setValue}
      />
    )
  }
  if (di.inputType === 'Select') {
    return (
      <QuestionaireSelect
        options={di.options}
        value={value}
        defaultValue={di.defaultValue}
        onChange={setValue}
      />
    )
  }
  throw new Error('not FormInput type')
}

interface ProgressProps {
  style?: any
  progress: number
  height: number
  width?: number | string
}
const Progress = ({
  style = {},
  progress = 0.5,
  height = 8,
}: ProgressProps) => {
  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: '#E6F2FA',
        ...style,
      }}
    >
      <View
        style={{
          height,
          width: progress * 100 + '%',
          backgroundColor: '#216DB8',
        }}
      />
    </View>
  )
}

const FormBackHandler = ({ onBack }) => {
  useEffect(() => {}, [])
  return null
}

export const QuestionaireForm = ({ navigation }) => {
  const { showSpinner, hide } = useHUD()
  const [formValue, setFormValue] = useState({})
  const inset = useSafeArea()
  const [index, setIndex] = useState(0)
  const isFocused = useIsFocused()

  const di = dataInputTable[index]
  const value = formValue[di.id]

  const setValue = (value) => {
    setFormValue({ ...formValue, [di.id]: value })
  }

  const onBack = useCallback(() => {
    if (index === 0) {
      navigation.pop()
    } else {
      setIndex(index - 1)
    }
  }, [index])
  const footer = (
    <Footer style={{ paddingBottom: inset.bottom }}>
      <Button            
        title={'ถัดไป'}
        titleStyle={{ fontFamily: FONT_FAMILY }}
        buttonStyle={{ height: 46, backgroundColor: '#216DB8', borderRadius: 10 }}
        containerStyle={{ width: '100%', borderRadius: 10 }}
        disabled={typeof value === 'undefined' || value?.length === 0}
        onPress={async () => {
          if (dataInputTable[index + 1]) {
            setIndex(index + 1)
          } else {
            showSpinner()
            await updateUserData({ questionaire: formValue })
            applicationState.setData('filledQuestionaire', true)
            navigation.navigate('QuestionaireSummary')
            hide()
          }
        }}
      />
    </Footer>
  )
  const fixedFooter = Dimensions.get('window').height > 700

  return (
    <Container>
      {isFocused ? <FormBackHandler onBack={onBack} /> : null}
      <StatusBar
        backgroundColor={COLORS.WHITE}
        barStyle="dark-content"
      />
      <FormHeader
        style={{ backgroundColor: 'white', paddingTop: inset.top }}
        onBack={onBack}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{di.title}</Text>
          {di.subtitle ? (
            <Text style={styles.subtitle}>{di.subtitle}</Text>
          ) : (
            void 0
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <Text
              style={{ fontFamily: FONT_FAMILY, marginRight: 12, fontSize: 16 }}
            >
              {index + 1} / {dataInputTable.length}
            </Text>
            <Progress
              height={8}
              style={{ flex: 1 }}
              progress={(index + 1) / dataInputTable.length}
            />
          </View>
        </View>
      </FormHeader>
      <ScrollView
        style={{
          flex: 1,
          borderTopColor: '#E6F2FA',
          borderTopWidth: 1,
        }}
        contentContainerStyle={{ justifyContent: 'center'  }}
      >
        {di ? (
          <FormDataInput
            key={di.id}
            di={di}
            setValue={setValue}
            value={value}
          />
        ) : null}
        {fixedFooter? null: footer}
      </ScrollView>
      {fixedFooter? footer: null}
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
