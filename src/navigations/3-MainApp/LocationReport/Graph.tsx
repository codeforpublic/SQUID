import React, { useEffect, useState, useCallback } from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis } from 'victory-native';
import { 
  View, 
  Text,
  StyleSheet 
} from 'react-native';
import { LocationCount } from './LocationCount';
import AsyncStorage from '@react-native-community/async-storage';

export const Graph = () => {
	const [location, setLocation] = useState([])
	const [homes, setHomeList] = useState([])
	const [offices, setOfficeList] = useState([])

	const getLocationList = useCallback(async () => {
    const homeLocation = await AsyncStorage.getItem('HOME-LIST');
    const homes = homeLocation ? JSON.parse(homeLocation) : [];
    setHomeList(homes);
  
    const officeLocation = await AsyncStorage.getItem('OFFICE-LIST');
    const offices = officeLocation ? JSON.parse(officeLocation) : [];
    setOfficeList(offices);
  }, []);
	
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
		getLocationList();
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
			<View style={styles.locationHistory}>
				<LocationCount name={"home"} size={homes.length}></LocationCount>
				<LocationCount name={"work"} size={offices.length}></LocationCount>
			</View>

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
		
		</View>
	)
}

const styles = StyleSheet.create({
	locationHistory: {
		display: "flex", 
		flexDirection: "row",
		paddingTop: 10,
		justifyContent: "space-between",
		paddingLeft: 55,
		paddingRight: 55,
	},
})