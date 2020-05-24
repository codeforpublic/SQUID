import React, { FunctionComponent, useEffect, useState, } from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryLine, VictoryGroup } from 'victory-native';
import { Dimensions } from 'react-native';

interface Props {
  width?: number;
  domainPaddingY?: [number, number];
  HOME?: number;
  OFFICE?: number;
  OTHER?: number;
  GPS?: number;
}

const GraphBarLocation: FunctionComponent<Props> = (props) => {

  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [domainPaddingY, setDomainPaddingY] = useState<[number, number]>([0, 0]);
  const [home, setHome] = useState<number>(props.HOME || 0);
  const [office, setOffice] = useState<number>(props.OFFICE || 0);
  const [other, setOther] = useState<number>(props.OTHER || 0);
  const [gps, setGps] = useState<number>(props.GPS || 0);

  useEffect(() => {
    if (props.width) {
      setWidth(props.width);
    }
    if (props.domainPaddingY) {
      setDomainPaddingY(props.domainPaddingY);
    } else {
      setDomainPaddingY([-50, -50]);
    }
    if (home + other + gps + office < 100) {
      setGps(100 - (home + other + office) + gps)
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
            cornerRadius={{ bottom: 2, top: other + gps + office ? 0 : 2 }}
            data={[{ x: "a", y: home }]} />
          <VictoryBar
            cornerRadius={{ bottom: home ? 0 : 2, top: gps + office ? 0 : 2 }}
            data={[{ x: "a", y: other }]} />
          <VictoryBar
            cornerRadius={{ bottom: home + other ? 0 : 2, top: office ? 0 : 2 }}
            data={[{ x: "a", y: gps }]} />
          <VictoryBar
            cornerRadius={{ bottom: home + other + gps ? 0 : 2, top: 2 }}
            data={[{ x: "a", y: office }]}
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