import React, { useEffect, useState } from 'react'
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis } from 'victory-native'
import { View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

export const Graph = () => {
	const [location, setLocation] = useState([])
	const myDataset = [
		[
			{ x: "a", y: 1 },
			{ x: "b", y: 2 },
			{ x: "c", y: 3 },
			{ x: "d", y: 2 },
			{ x: "e", y: 1 }
		],
		[
			{ x: "a", y: 2 },
			{ x: "b", y: 3 },
			{ x: "c", y: 4 },
			{ x: "d", y: 5 },
			{ x: "e", y: 5 }
		],
		[
			{ x: "a", y: 1 },
			{ x: "b", y: 2 },
			{ x: "c", y: 3 },
			{ x: "d", y: 4 },
			{ x: "e", y: 4 }
		]
	];

	useEffect(() => {
		setLocation(transformData(myDataset));
	}, [])

	const transformData = (dataset) => {
		const totals = dataset[0].map((data, i) => {
			return dataset.reduce((memo, curr) => {
				return memo + curr[i].y;
			}, 0);
		});
		return dataset.map((data) => {
			return data.map((datum, i) => {
				return { x: datum.x, y: (datum.y / totals[i]) * 100 };
			});
		});
	}

	return (
		<View>
			<VictoryChart horizontal
				domain={{ x: [0, 6.5], y: [-5, 100] }}
			>
				<VictoryStack horizontal
					colorScale={["#4CA8D9", "#9FA5B1", "#2B3A8C"]}
					style={{
						parent: {
							borderTopLeftRadius: 30,
							borderTopRightRadius: 30,
						}
					}}
				>
					{location.map((data, i) => {
						return <VictoryBar data={data} key={i} />;
					})}
				</VictoryStack>
				<VictoryAxis dependentAxis
					style={{
						axis: { stroke: "none", display: "none" }
					}}
					tickFormat={[]}
				/>
				<VictoryAxis
					style={{
						axis: { stroke: "none", display: "none" }
					}}
					tickFormat={["14 วัน", "7 วัน", "5 วัน", "3 วัน", "1 วัน"]}
				/>
			</VictoryChart>
		</View>
	)
}