import React, { useState } from 'react'
import { MyBackground } from '../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar, View, Text, StyleSheet, ScrollView } from 'react-native'
import { PrimaryButton } from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { COLORS, FONT_FAMILY, FONT_BOLD, FONT_SIZES } from '../styles'
import { CheckBox, normalize } from 'react-native-elements'
import { FormHeader } from '../components/Form/FormHeader'
import { getAgreementText, getAgreementTextBody1, getAgreementTextBody2, getAgreementTextBody3 } from './const'
import { Row, Table } from 'react-native-table-component'

import I18n from '../../i18n/i18n'

export const PrivacyPolicy = () => {
  const navigation = useNavigation()
  const [agree, setAgree] = useState(false)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle='dark-content' />
      <FormHeader backIcon='close'>
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t('privacy_policy')} </Text>
          <Text style={styles.subtitle}>{I18n.t('for_using_service')}</Text>
        </View>
      </FormHeader>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: 'white',
          }}
          style={{
            borderColor: COLORS.GRAY_2,
            borderWidth: 1,
            borderRadius: 4,
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.agreement}>{getAgreementTextBody1()} </Text>
            <ConsentTable
              key={1}
              row={2}
              headerData={[I18n.t('privacy_policy_table_01_header_01'), I18n.t('privacy_policy_table_01_header_02')]}
              rowData={[
                [I18n.t('privacy_policy_table_01_body_01_01'), I18n.t('privacy_policy_table_01_body_01_02')],
                [I18n.t('privacy_policy_table_01_body_02_01'), I18n.t('privacy_policy_table_01_body_02_02')],
              ]}
            />
            <Text style={styles.agreement}>{getAgreementTextBody2()} </Text>
            <ConsentTable
              key={2}
              row={2}
              headerData={[I18n.t('privacy_policy_table_02_header_01'), I18n.t('privacy_policy_table_02_header_02')]}
              rowData={[
                [I18n.t('privacy_policy_table_02_body_01_01'), I18n.t('privacy_policy_table_02_body_01_02')],
                [I18n.t('privacy_policy_table_02_body_02_01'), I18n.t('privacy_policy_table_02_body_02_02')],
                [I18n.t('privacy_policy_table_02_body_03_01'), I18n.t('privacy_policy_table_02_body_03_02')],
              ]}
            />
            <Text style={styles.agreement}>{getAgreementTextBody3()} </Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={I18n.t('close')}
          style={{ width: '100%' }}
          containerStyle={{ width: '100%' }}
          onPress={() => {
            navigation.pop()
          }}
        />
      </View>
    </SafeAreaView>
  )
}

type ConsentTablePropsType = {
  row: number
  rowData: any
  headerData: string[]
}

const ConsentTable = (props: ConsentTablePropsType) => {
  return (
    <View style={styles.tableContainer}>
      <Table>
        <Row style={styles.tableHead} data={props.headerData} />
        {props.rowData.map((rowData: []) => {
          return <Row textStyle={styles.tableText} data={rowData} style={{ alignItems: 'flex-start' }} />
        })}
      </Table>
    </View>
  )
}

const padding = normalize(16)

const styles = StyleSheet.create({
  tableText: { margin: 6 },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  tableHead: {
    padding: 8,
    backgroundColor: '#f1f8ff',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 16,
    marginHorizontal: padding,
  },

  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[700],
    alignItems: 'center',
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.SECONDARY_DIM,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_BLUE,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.BORDER_LIGHT_BLUE,

    paddingHorizontal: padding,
    marginBottom: 16,
  },
  agreement: {
    fontSize: FONT_SIZES[400],
    lineHeight: 24,
    color: COLORS.GRAY_4,
    marginBottom: 16,
    // textAlign: 'justify'
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: padding,
    marginBottom: 16,
  },
})
