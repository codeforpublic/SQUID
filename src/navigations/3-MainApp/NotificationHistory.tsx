import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { getNotifications } from '../../api-notification'
import { MyBackground } from '../../components/MyBackground'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'
import I18n from '../../../i18n/i18n'
import { ContractTracerContext } from '../../services/contact-tracing-provider'
import { useFocusEffect } from 'react-navigation-hooks'
import Autolink from 'react-native-autolink'

export interface NotificationHistoryModel {
  title: string
  type: string
  message: string
  sendedAt: string
  anonymousId: string
  isRead: true
}

const PAGE_SIZE = 20
// let cnt = 0

export const NotificationHistory = () => {
  const [history, setHistory] = useState<NotificationHistoryModel[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const { notificationTriggerNumber } = React.useContext(ContractTracerContext)

  const historyRef = React.useRef(history)
  historyRef.current = history

  useFocusEffect(
    React.useCallback(() => {
      getNotifications({ skip: 0, limit: PAGE_SIZE }).then(setHistory)
    }, []),
  )

  useEffect(() => {
    getNotifications({ skip: 0, limit: PAGE_SIZE }).then(setHistory)
  }, [notificationTriggerNumber])

  return (
    <MyBackground variant="light">
      <SafeAreaView style={styles.safeAreaView}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.PRIMARY_LIGHT}
        />
        <FlatList
          key={'list' + (notificationTriggerNumber ?? 0)}
          data={history}
          ListEmptyComponent={() => (
            <View style={styles.emptyTextView}>
              <Text style={styles.emptyText}>
                {I18n.t('notification_history_empty')}
              </Text>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            const notifications = await getNotifications({
              skip: 0,
              limit: PAGE_SIZE,
            })
            setHistory(notifications)
            setRefreshing(false)
          }}
          onEndReachedThreshold={0.5}
          onEndReached={async () => {
            const newHistory = await getNotifications({
              skip: historyRef.current.length,
              limit: PAGE_SIZE,
            })
            if (newHistory.length) {
              setHistory(historyRef.current.concat(newHistory))
            } else {
              setEndOfList(true)
            }
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.sectionLine} key={'c' + index}>
                <View style={styles.titleSection}>
                  <View>
                    <AntIcon
                      style={styles.iconStyle}
                      name={item.type === 'ALERT' ? 'warning' : 'infocirlceo'}
                      color={
                        item.type === 'ALERT'
                          ? COLORS.RED_WARNING
                          : COLORS.BLUE_INFO
                      }
                      size={16}
                    />
                  </View>
                  <View>
                    <Text
                      style={
                        item.type === 'ALERT'
                          ? styles.titleWarning
                          : styles.titleInfo
                      }
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>
                <Autolink style={styles.descriptionStyle} text={item.message} />
                <Text style={styles.dateStyle}>
                  {moment(item.sendedAt)
                    .format('DD MMM YYYY HH:mm น.')
                    .toString()}
                </Text>
              </View>
            )
          }}
        />
      </SafeAreaView>
    </MyBackground>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  sectionLine: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_5,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  titleWarning: {
    color: COLORS.RED_WARNING,
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
    fontWeight: '500',
  },
  titleInfo: {
    color: COLORS.BLUE_INFO,
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
    fontWeight: '500',
  },
  iconStyle: {
    position: 'relative',
    top: 4,
    paddingRight: 12,
  },
  descriptionStyle: {
    color: COLORS.BLACK_1,
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
  },
  dateStyle: {
    color: COLORS.GRAY_4,
    fontSize: FONT_SIZES[400],
    fontFamily: FONT_FAMILY,
  },
  emptyTextView: {
    flex: 1,
    height: '100%',
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    flex: 1,
    color: '#A0A4B1',
  },
})
