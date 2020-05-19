import React from 'react'
import { View, StyleSheet, Text } from "react-native";
import { VictoryStack, VictoryBar, VictoryChart, VictoryAxis } from "victory-native";
import { useEffect, useState } from "react";

export const LocationBar = () => {
  // const [locationData, setLocationData] = useState([]);

  // useEffect(()=> {
  //   // setLocationData();
  // });

  return (
    <View style={styles.locationBar}>
      <VictoryChart horizontal
        domain={{ x: [-5.5, 0], y: [0, 100] }}
      >
        <VictoryStack horizontal
          colorScale={["#4CA8D9", "#9FA5B1", "#2B3A8C"]}
          style={{
            data: {strokeWidth: 5, }
          }}
        >
          <VictoryBar data={[{ x: "a", y: 20 }]} />
          <VictoryBar data={[{ x: "a", y: 10 }]} />
          <VictoryBar data={[{ x: "a", y: 70 }]} />
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
  );
}

const styles = StyleSheet.create({
  locationBar: {
    height: 35
  },
})