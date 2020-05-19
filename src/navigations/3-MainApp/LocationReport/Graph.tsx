import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment-timezone'
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
		let list = [];
		let days = [0, 2, 4];
		for (let d of days) {
			let t = moment().add(d*(-1), "day").format("x");
			for (let i = 0; i < 144; i++) {
				let obj = {};
				if (i+d < 80)
					obj = {time: t, stay: "H"}
				if (i+d >= 80 && i < 100) 
					obj = {time: t, stay: "O"}
				if (i+d >= 100) 
					obj = {time: t, stay: "W"}
				list.push(obj)
			}
		}
		return list;
	}

	useEffect(() => {
		getLocationList();
		let data = prepareFromGraph(exampleData());
		setLocation(transformData(data));
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

	/**
	 * transform data to victory graph
	 * @param data -> { time: '1589814473374', stay: 'H | W | O' } *time = unix timestamp
	 */
	const prepareFromGraph = (data = []) => {
		let aDays = [], threeDays = [], fiveDays = [], aWeeks = [], twoWeeks = [];
		data.map(d => {
			let time = d.time;
			if (isToday(time)) {
				aDays.push(d)
			}
			if (isTheDayAgo(time, 3)) {
				threeDays.push(d)
			}
			if (isTheDayAgo(time, 5)) {
				fiveDays.push(d)
			}
			if (isTheDayAgo(time, 7)) {
				aWeeks.push(d)
			}
			if (isTheDayAgo(time, 14)) {
				twoWeeks.push(d)
			}
		});

		let aDay = getData(aDays);
		let threeDay = getData(threeDays);
		let fiveDay = getData(fiveDays);
		let sevenDay = getData(aWeeks);
		let fourteenDay = getData(twoWeeks);

		return [
			[//HOME
				{ x: "14", y: getPercentage(fourteenDay.home.length, 2016) },
				{ x: "7",  y: getPercentage(sevenDay.home.length, 1008) },
				{ x: "5",  y: getPercentage(fiveDay.home.length, 720) },
				{ x: "3",  y: getPercentage(threeDay.home.length, 432) },
				{ x: "1",  y: getPercentage(aDay.home.length, 144) }
			],
			[//OTHER
				{ x: "14", y: getPercentage(fourteenDay.other.length, 2016) },
				{ x: "7",  y: getPercentage(sevenDay.other.length, 1008) },
				{ x: "5",  y: getPercentage(fiveDay.other.length, 720) },
				{ x: "3",  y: getPercentage(threeDay.other.length, 432) },
				{ x: "1",  y: getPercentage(aDay.other.length, 144) }
			],
			[//WORK
				{ x: "14", y: getPercentage(fourteenDay.work.length, 2016) },
				{ x: "7",  y: getPercentage(sevenDay.work.length, 1008) },
				{ x: "5",  y: getPercentage(fiveDay.work.length, 720) },
				{ x: "3",  y: getPercentage(threeDay.work.length, 432) },
				{ x: "1",  y: getPercentage(aDay.work.length, 144) }
			]
		];
	}

	const getData = (list = []) => {
		return {
			home: getByType(list, "H"),
			other: getByType(list, "O"),
			work: getByType(list, "W"),
			total: list.length,
		}
	}

	const getByType = (list = [], stayAt) => {
		return list.filter(d => d.stay === stayAt);
	}

	const isToday = (uxtime) => {
		const toDay = moment();
		return (moment(uxtime, "x").isSame(toDay, "day"))
	}

	const isTheDayAgo = (uxtime, dayAgo) => {
		let modulus = dayAgo ? dayAgo * (-1) : 0;
		const threeDayAgo = moment().add(modulus, "days");
		return (moment(uxtime, "x").isSameOrAfter(threeDayAgo));
	}

	const getPercentage = (val, from) => {
		let percent = ((val * 100) / from).toFixed(2);
		return (percent && percent !== "NaN") ? parseFloat(percent) : 0;
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