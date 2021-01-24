import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import { MyBackground } from '../../components/MyBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import moment  from 'moment'
interface NotificationHistoryModel {
    status: string;
    title: string;
    description: string;
    date: Date
}
export const NotificationHistory = () => {
  const [history, setHistory] = useState<NotificationHistoryModel[]>([])
  useEffect(() => {
    const mockHistory: NotificationHistoryModel[] =  [
        {
            status: "WARNING",
            title: "ด่วน กรุณาโทรกลับ",
            description: "กรมควบคุมโรคต้องการติดต่อคุณ กรุณาติดต่อกลับด้วยที่เบอร์ 0821920192",
            date: new Date()
        },
        {
            status: "INFO",
            title: "กรอกแบบสอบถาม",
            description: "กรุณากรอกแบบสอบถามความพึงพอใจการใช้งาน Link: bitly.com/xieoak",
            date: new Date()
        },
        {
            status: "WARNING",
            title: "สถานะความเสี่ยงถูกเปลี่ยน",
            description: "สถานะการติดเชื้อถูกเปลี่ยนเป็น “เสี่ยงมาก” (สีแดง) คลิกเพื่ออ่านสาเหตุ",
            date: new Date()
        }
      ]
      setHistory(mockHistory)
  }, [])
  return (
    <MyBackground variant="light">
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
        >
         {
            history.map(item => {
                return (
                    <View style={styles.sectionLine}>
                        <View style={styles.titleSection}>
                            <View>
                                <AntIcon style={styles.iconStyle} name={item.status === 'WARNING' ? 'warning' : 'infocirlceo'} color={item.status === 'WARNING' ? COLORS.RED_WARNING : COLORS.BLUE_INFO} size={16}/>
                            </View>
                            <View>
                                <Text style={item.status === 'WARNING' ? styles.titleWarning : styles.titleInfo}>{ item.title }</Text>
                            </View>
                        </View>
                        <Text style={styles.descriptionStyle}>
                            { item.description}
                        </Text>
                        <Text style={styles.dateStyle}>
                            { moment(item.date).format('DD MMM YYYY HH:mm น.').toString() }
                        </Text>
                    </View>
                )
            })
         }
        </ScrollView>
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  sectionLine: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.GRAY_5,
  },
  titleSection: {
      flex: 1,
      flexDirection: 'row'
  },
  titleWarning: {
      color: COLORS.RED_WARNING,
      fontSize: FONT_SIZES[500],
      fontFamily: FONT_FAMILY,
      fontWeight: '500'
  },
  titleInfo: {
      color: COLORS.BLUE_INFO,
      fontSize: FONT_SIZES[500],
      fontFamily: FONT_FAMILY,
      fontWeight: '500'
  },
  iconStyle: {
      position: 'relative',
      top: 4,
      paddingRight: 12
  },
  descriptionStyle: {
      color: COLORS.BLACK_1,
      fontSize: FONT_SIZES[500],
      fontFamily: FONT_FAMILY
  },
  dateStyle: {
      color: COLORS.GRAY_4,
      fontSize: FONT_SIZES[400],
      fontFamily: FONT_FAMILY
  }
})
