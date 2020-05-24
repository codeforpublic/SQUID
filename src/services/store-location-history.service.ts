import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

export class StoreLocationHistoryService {

  public static HISTORY_TRACK_BY_HOUR_MINUTE = 'history-track-by-hour-each-minute';
  public static WFH_TODAY = 'wfh-today';
  public static WFH_YESTERDAY = 'wfh-yesterday';
  public static WFH_TWO_WEEKS = 'wfh-two-weeks';

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

  /***
   * Append service 
   * WFH_TWO_WEEKS
   * ex.https://jsbin.com/niwokokadi/edit?js,console
   * 
   * WFH_TODAY, WFH_YESTERDAY
   * ex.https://jsbin.com/zorijidepu/edit?js,console
   */
  public static async appendTrackLocation(date: string, last: { H: number, O: number, W: number, G: number }, storageType: string) {
    const limit = StoreLocationHistoryService.getLimitByType(storageType);
    const logStr = await AsyncStorage.getItem(storageType);
    const data = logStr === null ? {} : JSON.parse(logStr);
    
    const toKeyValue = (element) => ({ key: element, value: data[element] });
    const byOlderFirst = (a, b): number => +(a.key > b.key) || -(a.key < b.key);

    const newObj = {};
    const transformed = Object.keys(data).map(toKeyValue).sort(byOlderFirst).slice(-limit);
    transformed.forEach((element) => newObj[element.key] = element.value);

    newObj[date] = last;

    await AsyncStorage.setItem(storageType, JSON.stringify(newObj));
  }

  /***
   * Summarize data hourly
   * ex.https://jsbin.com/paxelozixo/2/edit?js,console
   */
  public static async summaryHourly(data: {[key: string]: { H: number, O: number, W: number, G: number }}[]) {
    const list = Object.keys(data);
    const results = {};
    for (let i = 0; i < list.length; i++) {
      let homeValue = 0, otherValue = 0, workValue = 0, noGPS = 0;
      const times = data[list[i]];
      for (let j = 0; j < times.length; j++) {
        const min = Object.keys(times[j])[0];
        if (times[j][min] === 'HOME') {
          homeValue++;
        } else if (times[j][min] === 'WORK')  {
          workValue++;
        } else if (times[j][min] === 'OTHER')  {
          otherValue++;
        } else {
          noGPS++;
        }
        const newKey = moment().add(Number(i), 'hour').format("YYYYMMDD-HH:00");
        const PERCENT = 100;
        results[newKey] = {
          H: (homeValue/times.length) * PERCENT, 
          O: (otherValue/times.length) * PERCENT, 
          W: (workValue/times.length) * PERCENT, 
          G: (noGPS/times.length) * PERCENT 
        };
      }
    }
    // should save results
    console.log(results);
  }

  private static getLimitByType(type) { 
    switch (type) {
      case StoreLocationHistoryService.WFH_TODAY:
        return 24;
      case StoreLocationHistoryService.WFH_YESTERDAY:
        return 24;
      case StoreLocationHistoryService.WFH_TWO_WEEKS:
        return 14;    
      default:
        return 14;
        break;
    }
  }
}