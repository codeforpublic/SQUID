import React, { FunctionComponent, useEffect, useState, } from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis } from 'victory-native';
import { Dimensions } from 'react-native';

interface Props {
  width?: number;
  domainPaddingY?: [number, number];
}

const GraphBarLocation: FunctionComponent<Props> = (props) => {

  const [width, setWidth] = useState(props.width);
  const [domainPaddingY, setDomainPaddingY] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (props.width) {
      setWidth(props.width);
    }
    if (props.domainPaddingY) {
      setDomainPaddingY(props.domainPaddingY);
    } else {
      setDomainPaddingY([-50, -50]);
    }
  }, [])

  return (
    <VictoryChart horizontal
      domain={{ x: [-5.5, 0], y: [0, 100] }}
      domainPadding={{ x: -1, y: domainPaddingY }}
      width={width}
    >
      <VictoryStack horizontal
        colorScale={["#4CA8D9", "#9FA5B1", "#eb4034", "#2B3A8C"]}
        style={{
          data: { strokeWidth: 5, }
        }}
      >
        <VictoryBar
          cornerRadius={{ bottom: 2 }}
          data={[{ x: "a", y: 20 }]} />
        <VictoryBar data={[{ x: "a", y: 20 }]} />
        <VictoryBar data={[{ x: "a", y: 30 }]} />
        <VictoryBar
          cornerRadius={{ top: 2 }}
          data={[{ x: "a", y: 30 }]}
        />
      </VictoryStack>
      {/* <VictoryLine /> */}
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

  )
}

export default GraphBarLocation;