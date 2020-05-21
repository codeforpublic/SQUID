import React from 'react'
import { View, StyleSheet, Text } from "react-native";
import { VictoryStack, VictoryBar, VictoryChart, VictoryAxis } from "victory-native";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS } from '../../../styles';

export const LocationBar = () => {
  // const [locationData, setLocationData] = useState([]);

  // useEffect(()=> {
  //   // setLocationData();
  // });

  return (
    <View style={styles.locationBar}>
      <Icon name={'home'} size={20} color={COLORS.GRAY_2} />
      <View>
        <VictoryChart horizontal
          domain={{ x: [-5.5, 0], y: [0, 100] }}
          domainPadding={{ x: -1, y: -100 }}
          width={260}
        >
          <VictoryStack horizontal
            colorScale={["#4CA8D9", "#9FA5B1", "#2B3A8C"]}
            style={{
              data: { strokeWidth: 5, }
            }}
          >
            <VictoryBar
              cornerRadius={{ bottom: 2 }}
              data={[{ x: "a", y: 20 }]} />
            <VictoryBar data={[{ x: "a", y: 10 }]} />
            <VictoryBar
              cornerRadius={{ top: 2 }}
              data={[{ x: "a", y: 70 }]}
            />
          </VictoryStack>
          <VictoryAxis dependentAxis
            style={{
              axis: { stroke: "none", display: "none", strokeWidth: "10" }
            }}
            tickFormat={[]}
          />
          <VictoryAxis
            style={{
              axis: { stroke: "none", display: "none", strokeWidth: "10" }
            }}
            tickFormat={[]}
          />
        </VictoryChart>

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