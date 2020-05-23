import React, { FunctionComponent, useEffect, useState, } from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryLine, VictoryGroup } from 'victory-native';
import { Dimensions } from 'react-native';

interface Props {
  width?: number;
  domainPaddingY?: [number, number];
}

const GraphBarLocation: FunctionComponent<Props> = (props) => {

  const [width, setWidth] = useState(Dimensions.get('window').width);
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
    <VictoryChart
      domain={{ x: [-5.5, 0], y: [0, 100] }}
      domainPadding={{ x: -1, y: domainPaddingY }}
      width={width}
    >
      <VictoryGroup
        style={{ data: { width: 4 } }}
        horizontal>
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
      </VictoryGroup>

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
      />
      <VictoryBar
        style={{
          data: {
            fill: '#9FA1A2',
            width: 25,
          }
        }}
        data={[
          { x: 1, y: 25, y0: 24.5 },
          { x: 2, y: 25, y0: 24.5 },
          { x: 3, y: 25, y0: 24.5 },
        ]} />
      <VictoryBar
        style={{
          data: {
            fill: '#9FA1A2',
            width: 25,
          }
        }}
        data={[
          { x: 1, y: 50, y0: 49.5 },
          { x: 2, y: 50, y0: 49.5 },
          { x: 3, y: 50, y0: 49.5 },
        ]} />
      <VictoryBar
        style={{
          data: {
            fill: '#9FA1A2',
            width: 25,
          }
        }}
        data={[
          { x: 1, y: 75, y0: 74.5 },
          { x: 2, y: 75, y0: 74.5 },
          { x: 3, y: 75, y0: 74.5 },
        ]} />
    </VictoryChart>

  )
}

export default GraphBarLocation;