import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StatusBar, StyleSheet, Text, View, Image } from 'react-native'
import Autolink from 'react-native-autolink'
import { SafeAreaView } from 'react-native-safe-area-context'
import I18n from '../../../i18n/i18n'
import { getNotifications } from '../../api-notification'
import { ContractTracerContext } from '../../services/contact-tracing-provider'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles'

export interface NotificationHistoryModel {
  title: string
  type: string
  message: string
  sendedAt: string
  anonymousId: string
  isRead: true
}

const PAGE_SIZE = 30
const PAGE_SIZE_LIMIT = 30
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
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle='dark-content' backgroundColor={COLORS.PRIMARY_LIGHT} />
      <FlatList
        key={'list' + (notificationTriggerNumber ?? 0)}
        data={history}
        ListEmptyComponent={() => (
          <View style={styles.emptyTextView}>
            <Text style={styles.emptyText}>{I18n.t('notification_history_empty')}</Text>
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
          if (historyRef.current.length >= PAGE_SIZE_LIMIT) return
          const newHistory = await getNotifications({
            skip: historyRef.current.length,
            limit: PAGE_SIZE,
          })
          if (newHistory.length) {
            const newList = historyRef.current.concat(newHistory)
            if (newList.length > PAGE_SIZE_LIMIT) {
              newList.length = PAGE_SIZE_LIMIT
            }
            setHistory(newList)
          }
        }}
        keyExtractor={(_, index) => 'noti' + index}
        renderItem={({ item }) => {
          return (
            <View style={styles.sectionLine}>
              <Text style={styles.dateStyle}>{moment(item?.sendedAt).format('DD MMMM').toString()}</Text>
              <View style={styles.titleSection}>
                <View style={styles.iconStyle}>
                  {item?.type === 'ALERT' ? (
                    <Image source={require('../../assets/red-horn.png')} resizeMode='contain' width={16} height={16} />
                  ) : (
                    <Image source={require('../../assets/blue-horn.png')} resizeMode='contain' width={16} height={16} />
                  )}
                </View>
                <View>
                  <Text style={item?.type === 'ALERT' ? styles.titleWarning : styles.titleInfo}>
                    {item?.title || ''}
                  </Text>
                </View>
              </View>
              <Autolink style={styles.descriptionStyle} text={item?.message || ''} />
            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLORS.BACKGROUND,
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
    color: COLORS.DARK_BLUE,
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
