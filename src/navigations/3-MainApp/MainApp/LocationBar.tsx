import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS } from '../../../styles';
import GraphBarLocation from '../../../components/GraphBarLocation';

export const LocationBar = () => {
  
  const [width, ] = useState(parseInt(((Dimensions.get('window').width * 70) / 100).toString(), 10));

  return (
    <View style={styles.locationBar}>
      <Icon name={'home'} size={20} color={COLORS.GRAY_2} />
      <View>
        {width && <GraphBarLocation width={width} />}
      </View>
      <Icon name={'building'} size={20} color={COLORS.GRAY_2} />
    </View>
  );
}

const styles = StyleSheet.create({
  locationBar: {
    height: 35,
    flexDirection: 'row',
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center',
  },
})