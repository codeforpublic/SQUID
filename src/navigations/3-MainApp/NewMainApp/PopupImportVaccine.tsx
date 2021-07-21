import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native'
import { FONT_BOLD, FONT_FAMILY } from '../../../styles'
import I18n from '../../../../i18n/i18n'

const PopupImportVaccine: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true)
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>{I18n.t('record_found')}</Text>
            <Text style={styles.description}>
              {I18n.t('vaccination_record_of')}
              {'\n'}สมิธ จอห์นสัน{'\n'}
              {I18n.t('found_from_mhopromt')}
              {'\n'}
              {I18n.t('import_this_record')}
            </Text>
            <View style={styles.buttonSection}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={[styles.textStyle, styles.textCancelButton]}>
                  {I18n.t('cancel')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOk]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={[styles.textStyle, styles.textOkButton]}>
                  {I18n.t('ok')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    elevation: 2,
    justifyContent: 'center',
    maxWidth: 128,
    width: '100%',
  },
  textStyle: {
    marginLeft: 48,
    marginRight: 48,
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    textAlign: 'center',
  },
  textOkButton: {
    color: '#fff',
  },
  textCancelButton: {
    color: '#1E4E87',
  },
  title: {
    color: '#1E4E87',
    fontFamily: FONT_BOLD,
    fontSize: 32,
    marginTop: 40,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    marginTop: 16,
    textAlign: 'center',
  },
  buttonSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 48,
    marginRight: 24,
    marginLeft: 24,
    marginBottom: 24,
  },
  buttonOk: {
    backgroundColor: '#1E4E87',
    color: '#fff',
  },
  buttonCancel: {
    backgroundColor: '#fff',
    borderColor: '#1E4E87',
    borderWidth: 1,
  },
})

export default PopupImportVaccine
