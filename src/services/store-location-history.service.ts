import AsyncStorage from "@react-native-community/async-storage";

export class StoreLocationHistoryService {

  public static HISTORY_TRACK_BY_HOUR_MINUTE = 'history-track-by-hour-each-minute';

  public static async trackLocationByTime(type) {
    const date = new Date();
    const hour = date.getHours();
    const logsString = await AsyncStorage.getItem(StoreLocationHistoryService.HISTORY_TRACK_BY_HOUR_MINUTE);
    let data = logsString === null ? {} : JSON.parse(logsString);
    if (!data[hour]) {
      data[hour] = {};
    }
    data[hour][date.valueOf()] = type;
    console.log('data: ', data);
    await AsyncStorage.setItem(StoreLocationHistoryService.HISTORY_TRACK_BY_HOUR_MINUTE, JSON.stringify(data));
  }

}