import React, { useEffect, useState, useCallback } from 'react';
import 'moment/locale/th'
import {
	View,
	Text,
	StyleSheet,
	Dimensions
} from 'react-native';
import { LocationCount } from './LocationCount';
import AsyncStorage from '@react-native-community/async-storage';
import GraphBarLocation from '../../../components/GraphBarLocation';
import { FONT_SIZES } from '../../../styles';
import { StoreLocationHistoryService } from '../../../services/store-location-history.service';
import moment from 'moment';

const getGraphWidth = (): number => {
	const width = Dimensions.get('window').width;
	return ((width * 85) / 100) - 50;
}

export const Graph = () => {
	const [location, setLocation] = useState([]);

	const [homes, setHomeList] = useState([]);
	const [offices, setOfficeList] = useState([]);
	const [locationTwoWeek, setLocationTwoWeek] = useState([]);

	const [items, setItems] = useState([
		{ title: "1 วัน", length: 1, item: null },
		{ title: "3 วัน", length: 3, item: null },
		{ title: "5 วัน", length: 5, item: null },
		{ title: "7 วัน", length: 7, item: null },
		{ title: "14 วัน", length: 14, item: null },
	]);
	const [graphWidth,] = useState(getGraphWidth());


	const getLocationList = useCallback(async () => {
		const homeLocation = await AsyncStorage.getItem('HOME-LIST');
		const homes = homeLocation ? JSON.parse(homeLocation) : [];
		setHomeList(homes);

		const officeLocation = await AsyncStorage.getItem('OFFICE-LIST');
		const offices = officeLocation ? JSON.parse(officeLocation) : [];
		setOfficeList(offices);

		const wfhTwoWeek = await AsyncStorage.getItem('wfh-two-weeks');
		const locationTwoWeek = wfhTwoWeek ? JSON.parse(wfhTwoWeek) : {};
		setLocationTwoWeek(locationTwoWeek);


		const dataTwoWeek = await StoreLocationHistoryService.getDataTwoWeek();
		console.log('dataTwoWeek: ', dataTwoWeek);
		if (dataTwoWeek) {
			console.log(dataTwoWeek);
			const format = 'YYYYMMDD-00:00';
			const result = items.map((item) => {
				// const date = moment().subtract(1, 'day');
				item.item = null;
				if (Object.keys(dataTwoWeek).length >= item.length) {
					const data = { H: 0, W: 0, O: 0, G: 0 };
					for (let i = 0; i < item.length; i++) {
						const date = moment().subtract(i + 1, 'day');
						const d = dataTwoWeek[date.format(format)];
						if (d) {
							data.H = d.H;
							data.W = d.W;
							data.O = d.O;
							data.G = d.G;
						} else {
							data.G = 100;
						}
					}
					console.log(data);
					const sum = Object.keys(data).reduce((acc, k) => acc + data[k], 0);
					console.log('sum: ', sum);
					item.item = {
						H: (data.H / sum) * 100,
						O: (data.O / sum) * 100,
						W: (data.W / sum) * 100,
						G: (data.G / sum) * 100
					}
				}
				return item;
			});
			console.log(result);
			setItems(result);
		}

	}, []);



	// const exampleData = () => {
	// 	return {
	// 		"20200514-00:00": { "H": 20, "O": 20, "W": 40, "G": 20 },
	// 		"20200515-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
	// 		"20200516-00:00": { "H": 0, "O": 80, "W": 0, "G": 20 },
	// 		"20200517-00:00": { "H": 0, "O": 50, "W": 0, "G": 50 },
	// 		"20200518-00:00": { "H": 50, "O": 0, "W": 0, "G": 50 },
	// 		"20200519-00:00": { "H": 20, "O": 10, "W": 50, "G": 20 },
	// 		"20200520-00:00": { "H": 20, "O": 20, "W": 40, "G": 20 },
	// 	};
	// }

	useEffect(() => {
		getLocationList();

		// // let data = transformData(exampleData());
		// let data = transformData(locationTwoWeek);
		// setLocation(prepareForChart(data));
	}, [])

	// const transformData = (objData: Object) => {
	// 	if (!objData) return [];

	// 	return Object.keys(objData).map(k => {
	// 		return {
	// 			date: k,
	// 			...objData[k],
	// 		};
	// 	}).sort(((a, b) => (a.date > b.date) ? 1 : (a.date === b.date) ? 0 : -1));
	// }

	// const prepareForChart = (data = []) => {
	// 	let amtDays = data.length;
	// 	if (data.length < 14) {
	// 		for (let i = 0; i < (14 - amtDays); i++) {
	// 			data.push({ date: "", H: 0, O: 0, W: 0, G: 0 });
	// 		}
	// 	}

	// 	let home = [], other = [], work = [], nogps = [];
	// 	let sumH = 0, sumO = 0, sumW = 0, sumG = 0;
	// 	data.forEach((v, i) => {
	// 		sumH += v.H;
	// 		sumO += v.O;
	// 		sumW += v.W;
	// 		sumG += v.G;

	// 		if (i === 0) {
	// 			if (amtDays < 1) {
	// 				sumH = 0; sumO = 0; sumW = 0; sumG = 0;
	// 			}
	// 			home.push({ "x": "1", "y": sumH });
	// 			work.push({ "x": "1", "y": sumW });
	// 			other.push({ "x": "1", "y": sumO });
	// 			nogps.push({ "x": "1", "y": sumG });
	// 		}
	// 		if (i === 2) {
	// 			if (amtDays < 3) {
	// 				sumH = 0; sumO = 0; sumW = 0; sumG = 0;
	// 			}
	// 			home.push({ "x": "3", "y": sumH / 3 });
	// 			work.push({ "x": "3", "y": sumW / 3 });
	// 			other.push({ "x": "3", "y": sumO / 3 });
	// 			nogps.push({ "x": "3", "y": sumG / 3 });
	// 		}
	// 		if (i === 4) {
	// 			if (amtDays < 5) {
	// 				sumH = 0; sumO = 0; sumW = 0; sumG = 0;
	// 			}
	// 			home.push({ "x": "5", "y": sumH / 5 });
	// 			work.push({ "x": "5", "y": sumW / 5 });
	// 			other.push({ "x": "5", "y": sumO / 5 });
	// 			nogps.push({ "x": "5", "y": sumG / 5 });
	// 		}
	// 		if (i === 6) {
	// 			if (amtDays < 7) {
	// 				sumH = 0; sumO = 0; sumW = 0; sumG = 0;
	// 			}
	// 			home.push({ "x": "7", "y": sumH / 7 });
	// 			work.push({ "x": "7", "y": sumW / 7 });
	// 			other.push({ "x": "7", "y": sumO / 7 });
	// 			nogps.push({ "x": "7", "y": sumG / 7 });
	// 		}
	// 		if (i === 13) {
	// 			if (amtDays < 14) {
	// 				sumH = 0; sumO = 0; sumW = 0; sumG = 0;
	// 			}
	// 			home.push({ "x": "14", "y": sumH / 14 });
	// 			work.push({ "x": "14", "y": sumW / 14 });
	// 			other.push({ "x": "14", "y": sumO / 14 });
	// 			nogps.push({ "x": "14", "y": sumG / 14 });
	// 		}
	// 	});

	// 	let result = [];
	// 	result.push(home.reverse());
	// 	result.push(other.reverse());
	// 	result.push(work.reverse());
	// 	result.push(nogps.reverse());

	// 	return result;
	// }


	return (
		<View>
			<View style={styles.locationHistory}>
				<LocationCount name={"home"} size={homes.length}></LocationCount>
				<LocationCount name={"work"} size={offices.length}></LocationCount>
			</View>

			<View style={styles.listGraphContainer}>
				{
					items.map(({ title, item }) => {
						return (
							<View style={styles.listGraphItem}>
								<View>
									<Text style={styles.listGraphLabel}>{title}</Text>
								</View>
								<View>
									<GraphBarLocation width={graphWidth} HOME={item ? item.H : 0} OFFICE={item ? item.W : 0} OTHER={item ? item.O : 0} GPS={item ? item.G : 0} />
								</View>
							</View>
						)
					})
				}
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
	listGraphContainer: {
		marginTop: 25,
		marginLeft: 25,
		marginRight: 25,
		alignContent: 'center',
		display: 'flex',
		flexDirection: 'column',
	},
	listGraphItem: {
		display: 'flex',
		flexDirection: 'row',
		height: 25,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
	},
	listGraphLabel: {
		color: '#9FA1A2',
		fontSize: FONT_SIZES[300],
		marginTop: 3
	}
})