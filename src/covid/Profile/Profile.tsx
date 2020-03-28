import React from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'
import { Icon, Divider } from 'react-native-elements'
import { COLORS, FONT_FAMILY } from '../../styles'
import { useUserInfo } from '../../common/state/user.state'
import { YESNO_QUESTIONS } from '../../common/form/data-input'
import { MyBackground } from '../MyBackground'
import { COUNTRIES } from '../../common/form/const'

const BlankState = ({ onEditProfile }) => {
  return (
    <View style={blankStyles.content}>
      <TouchableOpacity onPress={onEditProfile}>
        <View style={blankStyles.iconWrapper}>
          <Icon name={'edit'} type={'antdesign'} color={'white'} size={50} />
        </View>
      </TouchableOpacity>
      <Text style={blankStyles.title}>เริ่มต้นแก้ไขข้อมูลของคุณ </Text>
      <Text style={blankStyles.description}>
        รายละเอียดข้อมูลที่แชร์ให้คนอื่นๆ
      </Text>
    </View>
  )
}
const blankStyles = StyleSheet.create({
  iconWrapper: {
    backgroundColor: COLORS.PURPLE,
    width: 108,
    height: 108,
    borderRadius: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY_DARK,
    alignItems: 'center',
  },
  title: {
    marginTop: 40,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 28,
    lineHeight: 44,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
  description: {
    marginTop: 8,
    width: 262,
    marginBottom: 82,
    fontFamily: FONT_FAMILY,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    color: COLORS.GRAY_1,
  },
})

const DataItem = ({
  label,
  value,
  style,
}: {
  label: string
  value: string
  style?: Object
}) => {
  return (
    <View style={{ marginBottom: 8, ...style }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.content}>{value}</Text>
    </View>
  )
}

const YesNoItem = ({
  label,
  value,
  style,
  displayValue,
}: {
  label: string
  value: boolean
  displayValue: string
  style?: Object
}) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16, ...style }}>
      <View style={{ flex: 1, paddingRight: 24 }}>
        <Text style={styles.yesnoLabel}>{label}</Text>
      </View>
      <View
        style={{
          width: 57,
        }}
      >
        <View
          style={{
            backgroundColor: value ? COLORS.ORANGE : COLORS.BLACK_2,
            justifyContent: 'center',
            borderRadius: 5,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: COLORS.WHITE,
              textAlign: 'center',
              fontFamily: 'Prompt',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: 16,
            }}
          >
            {displayValue}
          </Text>
        </View>
      </View>
    </View>
  )
}
export const Profile = ({ navigation }) => {
  const [userInfo] = useUserInfo()
  const onEditProfile = () => navigation.navigate('EditProfile')
  const {
    nationalId,
    dob,
    email,
    firstname,
    lastname,
    gender,
    mobile,
    nationality,
    symptom1,
    symptom2,
    travel1,
    travel2,
    travel2a,
    travel3,
    community1,
    community2,
    community3,
  } = userInfo.data

  const nationalityLabel =
    nationality && COUNTRIES.find(c => c?.alpha2 === nationality)?.name

  return (
    <MyBackground variant="dark">
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar  backgroundColor={COLORS.PRIMARY_DARK} barStyle="light-content" />
        {!firstname ? (
          <BlankState onEditProfile={onEditProfile} />
        ) : (
          <>
            <View style={{ paddingVertical: 20, paddingHorizontal: 30 }}>
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>ข้อมูลส่วนตัว</Text>
                  <Text style={styles.subtitle}>
                    รายละเอียดข้อมูลที่แชร์ให้คนอื่นๆ{' '}
                  </Text>
                </View>
                <TouchableOpacity onPress={onEditProfile}>
                  <View
                    style={{
                      backgroundColor: COLORS.PURPLE,
                      borderRadius: 8,
                      alignItems: 'center',
                      width: 60,
                      height: 60,
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      name={'edit'}
                      type={'antdesign'}
                      color={'white'}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={{ flex: 1, paddingVertical: 20 }}>
              <View style={{ paddingHorizontal: 30 }}>
                <Text style={styles.sectionTitle}>ข้อมูลพื้นฐาน</Text>
                {firstname && (
                  <DataItem label="ชื่อ" value={`${firstname} ${lastname}`} />
                )}
                <View style={{ flexDirection: 'row' }}>
                  {dob && (
                    <DataItem
                      style={{ marginRight: 32 }}
                      label="วันเกิด"
                      value={dob}
                    />
                  )}
                  {gender && (
                    <DataItem
                      style={{ marginRight: 32 }}
                      label="เพศ"
                      value={{ F: 'หญิง', M: 'ชาย' }[gender]}
                    />
                  )}
                  {nationalityLabel && (
                    <DataItem label="สัญชาติ" value={nationalityLabel} />
                  )}
                </View>
              </View>
              {(mobile || email) && (
                <>
                  <Divider style={styles.divider} />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text style={styles.sectionTitle}>ติดต่อ</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {mobile ? (
                        <DataItem
                          style={{ marginRight: 32 }}
                          label="เบอร์ติดต่อ"
                          value={mobile}
                        />
                      ) : null}
                      {email ? (
                        <DataItem label="อีเมล" value={email} />
                      ) : (
                        void 0
                      )}
                    </View>
                  </View>
                </>
              )}
              {(symptom1 || symptom2) && (
                <>
                  <Divider style={styles.divider} />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text style={styles.sectionTitle}>อาการป่วย</Text>
                    {symptom1 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.symptom1}
                        displayValue={symptom1 === 'true' ? 'มี' : 'ไม่มี'}
                        value={symptom1 === 'true'}
                      />
                    )}
                    {symptom2 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.symptom2}
                        displayValue={symptom2 === 'true' ? 'มี' : 'ไม่มี'}
                        value={symptom2 === 'true'}
                      />
                    )}
                  </View>
                </>
              )}
              {(travel1 || travel2 || travel2a || travel3) && (
                <>
                  <Divider style={styles.divider} />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text style={styles.sectionTitle}>การเดินทาง</Text>
                    {travel1 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.travel1}
                        displayValue={travel1 === 'true' ? 'ไป' : 'ไม่ไป'}
                        value={travel1 === 'true'}
                      />
                    )}
                    {travel2 && (
                      <YesNoItem
                        label={`${YESNO_QUESTIONS.travel2} ${
                          travel2a ? `(${travel2a})` : ''
                        }`}
                        displayValue={travel2 === 'true' ? 'ไป' : 'ไม่ไป'}
                        value={travel2 === 'true'}
                      />
                    )}
                    {travel3 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.travel3}
                        displayValue={travel3 === 'true' ? 'ไป' : 'ไม่ไป'}
                        value={travel3 === 'true'}
                      />
                    )}
                  </View>
                </>
              )}
              {(community1 || community2 || community3) && (
                <>
                  <Divider style={styles.divider} />
                  <View style={{ paddingHorizontal: 30 }}>
                    <Text style={styles.sectionTitle}>โอกาสติดเชื้อ</Text>
                    {community1 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.community1}
                        displayValue={community1 === 'true' ? 'มี' : 'ไม่มี'}
                        value={community1 === 'true'}
                      />
                    )}
                    {community2 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.community2}
                        displayValue={community2 === 'true' ? 'ใช่' : 'ไม่ใช่'}
                        value={community2 === 'true'}
                      />
                    )}
                    {community3 && (
                      <YesNoItem
                        label={YESNO_QUESTIONS.community3}
                        displayValue={community3 === 'true' ? 'ใช่' : 'ไม่ใช่'}
                        value={community3 === 'true'}
                      />
                    )}
                  </View>
                </>
              )}
              <View style={{ paddingTop: 16 }} />
            </ScrollView>
          </>
        )}
      </View>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Prompt',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  sectionTitle: {
    fontFamily: 'Prompt',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    color: COLORS.PRIMARY_LIGHT,
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Prompt',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 24,
    color: '#9b9ca2',
  },
  content: {
    fontFamily: 'Prompt',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 30,
    color: COLORS.GRAY_3,
  },
  yesnoLabel: {
    fontFamily: 'Prompt',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 30,
    color: COLORS.WHITE,
  },
  subtitle: {
    fontFamily: 'Prompt',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 30,
    alignItems: 'center',
    color: COLORS.PRIMARY_LIGHT,
  },
  divider: {
    backgroundColor: COLORS.GRAY_3,
    height: StyleSheet.hairlineWidth,
    marginVertical: 20,
  },
})
