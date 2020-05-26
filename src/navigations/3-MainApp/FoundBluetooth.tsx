import React, { FunctionComponent, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../styles';
import { bluetoothScanner } from '../../services/contact-scanner';

interface Props {
  count: number;
}

const FoundBluetooth: FunctionComponent<Props> = (props) => {


  return (
    <View style={styles.container}>
      <Text style={styles.textLabel}>จำนวนบลูทูธที่พบ</Text>
      <View style={styles.boxCount}>
        <Text style={styles.boxCountText}>{ props.count || 0 }</Text>
      </View>
    </View>
  )
}

export default FoundBluetooth;


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textLabel: {
    color: '#888888',
    fontSize: FONT_SIZES[500],
    fontFamily: FONT_FAMILY,
    marginRight: 10
  },
  boxCount: {
    padding: 1,
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: 20,
    minWidth: 60
  },
  boxCountText: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
    textAlign: 'center',
  }
});