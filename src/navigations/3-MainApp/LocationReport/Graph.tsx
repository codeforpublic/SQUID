import React, { useEffect, useState, useCallback } from 'react';
import 'moment/locale/th'
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

	const exampleData = () => {
		return {
			"20200514-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200515-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200516-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200517-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200518-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200519-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200520-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200521-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200522-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
			"20200523-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 }, //10
		};
	}

	useEffect(() => {
		getLocationList();
		let data = transformData(exampleData());
		setLocation(prepareForChart(data));
	}, [])

	const transformData = (objData: Object) => {
		if (!objData) return [];
		
		return Object.keys(objData).map(k => { 
			return {
				date: k,
				...objData[k],
			};
		}).sort(((a, b) => (a.date > b.date) ? 1 : (a.date === b.date) ? 0 : -1 ));
	}

	const prepareForChart = (data = []) => {
		let amtDays = data.length;
		if (data.length < 14) {
			for (let i=0; i < (14 - amtDays); i++) {
				data.push({date: "", H: 0, O: 0, W: 0, G: 0});
			}
		}
	
		let home = [], other = [], work = [], nogps = [];
		let sumH = 0, sumO = 0, sumW = 0, sumG = 0;
		data.forEach((v, i)=> {
			sumH += v.H;
			sumO += v.O;
			sumW += v.W;
			sumG += v.G;
	
			if (i === 0) {
				if (amtDays < 1) {
					sumH = 0; sumO = 0; sumW = 0; sumG = 0;
				}
				home.push({"x": "1", "y": sumH});
				work.push({"x": "1", "y": sumW});
				other.push({"x": "1", "y": sumO});
				nogps.push({"x": "1", "y": sumG});
			}
			if (i === 2) {
				if (amtDays < 3) {
					sumH = 0; sumO = 0; sumW = 0; sumG = 0;
				}
				home.push({"x": "3", "y": sumH / 3});
				work.push({"x": "3", "y": sumW / 3});
				other.push({"x": "3", "y": sumO / 3});
				nogps.push({"x": "3", "y": sumG / 3});
			}
			if (i === 4) {
				if (amtDays < 5) {
					sumH = 0; sumO = 0; sumW = 0; sumG = 0;
				}
				home.push({"x": "5", "y": sumH / 5});
				work.push({"x": "5", "y": sumW / 5});
				other.push({"x": "5", "y": sumO / 5});
				nogps.push({"x": "5", "y": sumG / 5});
			}
			if (i === 6) {
				if (amtDays < 7) {
					sumH = 0; sumO = 0; sumW = 0; sumG = 0;
				}
				home.push({"x": "7", "y": sumH / 7});
				work.push({"x": "7", "y": sumW / 7});
				other.push({"x": "7", "y": sumO / 7});
				nogps.push({"x": "7", "y": sumG / 7});
			}
			if (i === 13) {
				if (amtDays < 14) {
					sumH = 0; sumO = 0; sumW = 0; sumG = 0;
				}
				home.push({"x": "14", "y": sumH / 14});
				work.push({"x": "14", "y": sumW / 14});
				other.push({"x": "14", "y": sumO / 14});
				nogps.push({"x": "14", "y": sumG / 14});
			}
		});
	
		let result = [];
		result.push(home.reverse());
		result.push(other.reverse());
		result.push(work.reverse());
		result.push(nogps.reverse());
	
		return result;
	}


	return (
		<View>
			<View style={styles.locationHistory}>
				<LocationCount name={"home"} size={homes.length}></LocationCount>
				<LocationCount name={"work"} size={offices.length}></LocationCount>
			</View>

			<View>
				<VictoryChart horizontal
					domain={{ x: [0, 5], y: [0, 100] }}
				>
					<VictoryStack horizontal
						colorScale={["#4CA8D9", "#9FA5B1", "#2B3A8C", "#F24726"]}
						style={{
							data: {strokeWidth: 0.1, stroke: "#FFFFFF"}
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