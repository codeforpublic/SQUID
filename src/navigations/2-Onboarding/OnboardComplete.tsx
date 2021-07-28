import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/AntDesign'
import I18n from '../../../i18n/i18n'
import { PrimaryButton } from '../../components/Button'
import { COLORS, FONT_BOLD, FONT_SIZES } from '../../styles'
import { useResetTo } from '../../utils/navigation'

export const OnboardComplete = () => {
  const STRING = {
    TITLE: I18n.t('register_successfully'),
    SUB_TITLE: I18n.t('can_start_using_now'),
    NEXT_BUTTON: I18n.t('start'),
  }
  // const navigation = useNavigation()
  const resetTo = useResetTo()
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.WHITE} barStyle='dark-content' />
      <View style={styles.header}>
        <Text style={styles.title}>{STRING.TITLE}</Text>
        <Text style={styles.subtitle}>{STRING.SUB_TITLE}</Text>
      </View>
      <View style={styles.content}>
        <Icon name='checkcircleo' color={COLORS.GREEN} size={250} />
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={STRING.NEXT_BUTTON}
          style={{ width: '100%' }}
          containerStyle={{ width: '100%' }}
          onPress={() => {
            // if (applicationState.getData(
            //   'filledQuestionaireV2',
            // )) {
            //   resetTo({ routeName: 'MainApp' })
            // } else {
            //   resetTo({ routeName: 'Questionaire' })
            // }
            resetTo({ name: 'MainApp' })
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  header: {
    alignItems: 'center',
  },

  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[600],
    lineHeight: 40,
    alignItems: 'center',
    color: COLORS.BLACK_1,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZES[500],
    lineHeight: 24,
    alignItems: 'center',
    color: COLORS.GRAY_2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
})
