import React from 'react'
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import I18n from '../../../../i18n/i18n'
import { useVaccine } from '../../../services/use-vaccine'
import { FONT_BOLD, FONT_FAMILY } from '../../../styles'

const PopupImportVaccine: React.FC<{
  onSelect: (status: 'ok' | 'cancel') => void
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
}> = ({ onSelect, modalVisible, setModalVisible }) => {
  const { vaccineList, getVaccineUserName } = useVaccine()
  const vaccine = vaccineList && vaccineList[0]

  const name = vaccine && getVaccineUserName ? getVaccineUserName(vaccine) : ''

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(false)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>{I18n.t('record_found')}</Text>
            <Text style={styles.description}>
              {I18n.t('vaccination_record_of')}
              {`\n${name}\n`}
              {I18n.t('vaccination_found')}
              {'\n\n'}
              {I18n.t('import_this_record')}
            </Text>
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModalVisible(false)
                  onSelect('cancel')
                }}
              >
                <Text style={[styles.textStyle, styles.textCancelButton]}>{I18n.t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOk]}
                onPress={() => {
                  setModalVisible(false)
                  onSelect('ok')
                }}
              >
                <Text style={[styles.textStyle, styles.textOkButton]}>{I18n.t('ok')}</Text>
              </TouchableOpacity>
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
    paddingVertical: 5,
    width: 115,
  },
  textStyle: {
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
    marginTop: 15,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    marginTop: 16,
    textAlign: 'center',
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 48,
    marginRight: 24,
    marginLeft: 24,
    marginBottom: 24,
  },
  buttonOk: {
    marginLeft: 10,
    backgroundColor: '#1E4E87',
    color: '#fff',
  },
  buttonCancel: {
    marginRight: 10,
    backgroundColor: '#fff',
    borderColor: '#1E4E87',
    borderWidth: 1,
  },
})

export default PopupImportVaccine
