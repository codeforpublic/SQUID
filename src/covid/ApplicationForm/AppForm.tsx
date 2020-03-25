import React, { useState, useEffect } from 'react'
import { Image, Text, View, StyleSheet, StatusBar, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { PrimaryButton, DangerButton } from '../Button'
import { CheckBox, Icon } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  ApplicationMutation,
  useFetchApplication,
  useApplication,
} from '../../common/state/application.state'
import { useHUD } from '../../HudView'
import { MyBackground } from '../MyBackground'
import { DEFAULT_APPLICATION_ID } from '../const'
import AsyncStorage from '@react-native-community/async-storage'
import { Logo } from '../../components/Logo'
import { useNavigation } from 'react-navigation-hooks'
import { refreshBackgroundTracking } from '../BackgroundTracking'

const campaignInfo = {
  version: 'v1beta1',
  id: 'demo',
  displayName: 'Application Name',
  logo: 'http://acmelogos.com/images/logo-7.svg',
  description: 'bra bra bra',
  permissions: ['location:real_time', 'data:*'],
  url: {
    privacy_policy: 'https://acme.org/privacy',
    tos: 'https://acme.org/terms',
    'hook:location': 'https://acme.org/webhook/location',
    'hook:data': 'https://acme.org/webhook/data-update',
  },
}
/* 
  fightcovid19://app/sq
*/
export const AppForm = () => {
  const { showSpinner, hide } = useHUD()
  const navigation = useNavigation<{ params: {
    applicationId: string,
    permissions?: Permission[]
  } }>()
  const applicationId = navigation?.state?.params?.applicationId
  const permissions = navigation?.state?.params?.permissions  
  const [appCampaign, loading, error] = useFetchApplication(applicationId)
  const [saveApplication] = useMutation(ApplicationMutation.saveApplication)
  const [application] = useApplication(applicationId)

  const resetToMainTab = () => {
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
  }
  if (loading) {
    return null
  }
  if (!appCampaign) {
    Alert.alert('ไม่พบ Campaign นี้')
    resetToMainTab()
    return null
  }
  console.log('permissions', permissions)
  const askForId = (!permissions && appCampaign.permissions.includes('data:*')) || permissions.includes('data:id')
  const askForLocation = (!permissions && appCampaign.permissions.includes('location:real_time')  ) || permissions.includes('location:real_time')
  const askForCovid = (!permissions && appCampaign.permissions.includes('data:*')) || permissions.includes('data:covid')
  // console.log('appCampaign.logo', appCampaign.logo)
  return (
    <MyBackground variant="light">
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Logo uri={appCampaign.logo} size={200} />
          <Text style={styles.title}>ขอสิทธิเข้าถึงข้อมูล</Text>
          {/* <Text style={styles.description}>{appCampaign.description}</Text> */}
          <View style={styles.checkboxContainer}>
            {askForId && <CheckBox
              title="ต้องการข้อมูลส่วนตัวพื้นฐาน, ระบุตัวตน"
              containerStyle={styles.checkboxItemContainer}
              checked
              checkedColor={COLORS.BLUE}
              textStyle={styles.checkboxLabel}
            />}
            {askForLocation && <CheckBox
              title="ต้องการตำแหน่งที่อยู่"
              containerStyle={styles.checkboxItemContainer}
              checked
              checkedColor={COLORS.BLUE}
              textStyle={styles.checkboxLabel}
            />}
            {askForLocation && <CheckBox
              title="ต้องการข้อมูลเรียลไทม์"
              containerStyle={styles.checkboxItemContainer}
              checked
              checkedColor={COLORS.BLUE}
              textStyle={styles.checkboxLabel}
            />}
            {askForCovid && <CheckBox
              title="ต้องตอบแบบประเมินความเสี่ยง COVID-19"
              containerStyle={styles.checkboxItemContainer}
              checked
              checkedColor={COLORS.BLUE}
              textStyle={styles.checkboxLabel}
            />}
          </View>
          <PrimaryButton
            title="อนุญาตให้เข้าถึง"
            style={{ width: '100%' }}
            onPress={async () => {
              showSpinner()
              await saveApplication({
                variables: {
                  application: {
                    ...appCampaign,
                    deleted: false,
                    allowPermissions: permissions || appCampaign.permissions,
                    type: 'campaign',
                  },
                },
              })
              await refreshBackgroundTracking()
              hide()
              if (appCampaign.id === DEFAULT_APPLICATION_ID) {
                // set to tell that they already submit
                await AsyncStorage.setItem(
                  'optOutCampaign',
                  JSON.stringify({ timestamp: Date.now() }),
                )
              }
              if (campaignInfo.permissions.indexOf('data:*') >= 0) {
                navigation.navigate('AppFormMoreInfo', {
                  applicationId: appCampaign.id,
                  application: application,
                  permissions
                })
              } else {
                Alert.alert(
                  'แชร์ข้อมูล',
                  `ข้อมูลของคุณได้ถูกแชร์ไปยัง ${appCampaign.displayName} แล้ว`,
                )
                resetToMainTab()
              }
            }}
          />
          <DangerButton
            title="ไม่อนุญาต"
            style={{ width: '100%', marginTop: 10 }}
            onPress={async () => {
              console.log('appCampaign', appCampaign, appCampaign.id === DEFAULT_APPLICATION_ID)
              if (appCampaign.id === DEFAULT_APPLICATION_ID) {
                await AsyncStorage.setItem(
                  'optOutCampaign',
                  JSON.stringify({ timestamp: Date.now() }),
                )
              }
              Alert.alert(
                'ไม่แชร์ข้อมูล',
                `ข้อมูลของคุณไม่ได้ถูกแชร์ไปยัง ${appCampaign.displayName} แล้ว`,
              )
              resetToMainTab()
            }}
          />
        </View>
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    marginTop: 40,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 29,
    lineHeight: 44,
    textAlign: 'left',
    color: COLORS.PRIMARY_DARK,
    width: 310,
  },
  description: {
    marginTop: 20,
    width: 310,
    marginBottom: 20,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 26,
    textAlign: 'left',
    color: COLORS.PRIMARY_DARK,
  },
  checkboxContainer: {
    marginTop: 20,
    marginBottom: 82,
    marginLeft: -10,
  },
  checkboxItemContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
  },
  checkboxLabel: {
    color: COLORS.GRAY_4,
    fontFamily: FONT_FAMILY,
    fontWeight: '300',
    fontSize: 16,
  },
})
