import React, { useRef } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
  findNodeHandle,
} from 'react-native'
import { Icon } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from '../../styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { CampaignDataInputForm } from '../ApplicationForm/AppFormMoreInfo'
import { useUserInfo } from '../../common/state/user.state'
import { NavigationActions, StackActions } from 'react-navigation'
import { MyBackground } from '../MyBackground'
import { dataInputTable } from '../../common/form/data-input'

export const EditProfile = ({ navigation }) => {
  const [userInfo] = useUserInfo()
  const scrollRef = useRef(null)
  const onValidationError = (err, ref) => {
    const scrollView = scrollRef.current
    requestAnimationFrame(() => {
      ref.measureLayout(findNodeHandle(scrollView), (x, y) => {
        scrollView.scrollTo({ x: 0, y: y, animated: true })
      })
    })
  }

  return (
    <MyBackground variant="dark">
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle={'light-content'} />
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 20 }}
            onPress={() => {
              navigation.goBack()
            }}
            // style={{ marginRight: 20 }}
          >
            <Icon name="left" type="antdesign" color={'white'} />
          </TouchableOpacity>
          <Text style={styles.title}>แก้ไขข้อมูล</Text>
        </View>
        <KeyboardAwareScrollView
          style={{ flexGrow: 1, backgroundColor: COLORS.PRIMARY_LIGHT }}
          ref={scrollRef}
        >
          <CampaignDataInputForm
            onValidationError={onValidationError}
            dataInputs={dataInputTable}
            userInfo={userInfo?.data}
            onComplete={() => {
              Alert.alert('แก้ไขข้อมูล', `ข้อมูลของคุณได้ถูกแก้ไขแล้ว`)

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
              setTimeout(() => {
                navigation.navigate('Me')
              }, 0)
            }}
          />
          <View
            style={{
              marginTop: 20,
            }}
          />
        </KeyboardAwareScrollView>
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  title: {
    flex: 1,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 44,
    color: 'white',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
