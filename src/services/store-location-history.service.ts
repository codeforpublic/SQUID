import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

export enum LOCATION_TYPE {
  HOME = 'HOME',
  OTHER = 'OTHER',
  OFFICE = 'OFFICE',
}
export class StoreLocationHistoryService {

  public static HOUR_FORMAT = 'YYYYMMDD-HH:00';
  public static DAY_FORMAT = 'YYYYMMDD-00:00';

  // 15 minute
  public static HISTORY_TRACK_BY_HOUR_MINUTE = 'history-track-by-hour-each-minute';
  // today by hour
  public static WFH_TODAY = 'wfh-today';
  // data yesterday
  public static WFH_YESTERDAY = 'wfh-yesterday';
  // data 14 day
  public static WFH_TWO_WEEKS = 'wfh-two-weeks';


  public static async getDataYesterday() {
    const raw = await AsyncStorage.getItem(this.WFH_YESTERDAY);
    return raw ? JSON.parse(raw) : null;
  }

  public static async getDataTwoWeek() {
    const raw = await AsyncStorage.getItem(this.WFH_TWO_WEEKS);
    return raw ? JSON.parse(raw) : null;
    // return {
    //   "20200523-00:00": { "H": 100, "O": 0, "W": 0, "G": 0 },
    //   "20200522-00:00": { "H": 0, "O": 10, "W": 60, "G": 30 },
    //   "20200521-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200520-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200519-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200518-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200517-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200516-00:00": { "H": 100, "O": 0, "W": 0, "G": 0 },
    //   "20200515-00:00": { "H": 0, "O": 10, "W": 60, "G": 30 },
    //   "20200514-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200513-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200512-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200511-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    //   "20200510-00:00": { "H": 0, "O": 30, "W": 60, "G": 10 },
    // }
    
  }


  public static async callStackData(type: LOCATION_TYPE) {
    const date = new Date();
    const hour = date.getHours();
    const day  = date.getDate();
    console.log(hour, day, type);
    // today minute
    const dateByHour = moment().format(this.HOUR_FORMAT);
    await this.trackLocationByTime(type);
    let data = await AsyncStorage.getItem(this.HISTORY_TRACK_BY_HOUR_MINUTE);

    // append data
    // 15 minute
    await this.summaryHourly(data ? JSON.parse(data) : {});
    // today by hour
    await this.appendTrackLocation(dateByHour, { G: 0, H: 0, O: 25, W: 75 }, this.WFH_TODAY);

    // clear data;
    // 15 minute
    await this.clearDataTrackTodayHour();
    // move data from yester
    await this.moveDataFromYesterday();
    // append data yester day to 2weeks
    await this.summaryYesterdayForAppend();
  }


  public static async clearDataTrackTodayHour() {
    const date = moment().add(1, 'hour').set('minute', 0).set('second', 0).set('millisecond', 0);
    let raw = await AsyncStorage.getItem(this.WFH_TODAY);
    let data = raw ? JSON.parse(raw) : {};
    if (data[date.format(this.HOUR_FORMAT)]) {
      raw = await AsyncStorage.getItem(this.HISTORY_TRACK_BY_HOUR_MINUTE);
      data = raw ? JSON.parse(raw) : {};
      const result = {};
      let date = moment().set('minute', 0).set('second', 0).set('millisecond', 0);
      Object.keys(data).forEach((hour) => {
        const d =  data[hour].filter((a) => {
          const timestamp = Object.keys(a)[0];
          return !moment(Number(timestamp)).isBefore(date);
        })
        console.log(d);
        if (d.length > 0) {
          result[hour] = d;
        }
      })
      await AsyncStorage.setItem(StoreLocationHistoryService.HISTORY_TRACK_BY_HOUR_MINUTE, JSON.stringify(result));
    }
  }

  public static async moveDataFromYesterday() {
    const date = moment().subtract(1, 'day');
    const rawYesterday = await AsyncStorage.getItem(this.WFH_YESTERDAY);
    const dataYesterday = rawYesterday ? JSON.parse(rawYesterday) : null;
    if (dataYesterday && Object.keys(dataYesterday).length > 0 && dataYesterday[date.format(this.HOUR_FORMAT)]) {
      return;
    }
    const rawToday = await AsyncStorage.getItem(this.WFH_TODAY);
    const dataToday = rawToday ? JSON.parse(rawToday) : {};
    if (Object.keys(dataToday).length === 0) {
      return;
    }

    const result = {}
    for(let i = 0;i < 24;i++) {
      const dateFormat = date.set('hour', i).format(this.HOUR_FORMAT);
      if (dataToday[dateFormat]) {
        result[dateFormat] = {...dataToday[dateFormat]};
        delete dataToday[dateFormat];
      } else {
        result[dateFormat] = {G: 100, H: 0, O: 0, W: 0};
      }
    }
    await AsyncStorage.setItem(this.WFH_YESTERDAY, JSON.stringify(result));
    await AsyncStorage.setItem(this.WFH_TODAY, JSON.stringify(dataToday));
  }

  public static async trackLocationByTime(type: LOCATION_TYPE) {
    const date = new Date();
    const hour = date.getHours();
    const logsString = await AsyncStorage.getItem(this.HISTORY_TRACK_BY_HOUR_MINUTE);
    let data = logsString === null ? {} : JSON.parse(logsString);
    if (!Array.isArray(data[hour])) {
      data[hour] = [];
    }
    data[hour].push({[date.valueOf()]: type});
    return await AsyncStorage.setItem(this.HISTORY_TRACK_BY_HOUR_MINUTE, JSON.stringify(data));
  }

  public static async summaryYesterdayForAppend() {
    const date = moment().subtract(1, 'day');
    const rawYesterday = await AsyncStorage.getItem(this.WFH_YESTERDAY);
    const dataYesterday = rawYesterday ? JSON.parse(rawYesterday) : null;

    const keyDataYesterday = Object.keys(dataYesterday);
    if (keyDataYesterday.length < 24) {
      return;
    }

    let latest = {
      H: 0,
      O: 0,
      W: 0,
      G: 0
    };
    
    for (let i = 0; i < keyDataYesterday.length; i++) {
      if (dataYesterday[keyDataYesterday[i]]) {
        latest.H += dataYesterday[keyDataYesterday[i]].H;
        latest.O += dataYesterday[keyDataYesterday[i]].O;
        latest.W += dataYesterday[keyDataYesterday[i]].W;
        latest.G += dataYesterday[keyDataYesterday[i]].G;
      }
    }

    latest.H = latest.H / keyDataYesterday.length;
    latest.O = latest.O / keyDataYesterday.length;
    latest.W = latest.W / keyDataYesterday.length;
    latest.G = latest.G / keyDataYesterday.length;

    await this.appendTrackLocation(date.format(this.DAY_FORMAT), latest, this.WFH_TWO_WEEKS);
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
        switch (times[j][min]) {
          case LOCATION_TYPE.HOME:
            homeValue++;
            break;
          case LOCATION_TYPE.OFFICE:
            workValue++;
            break;
          case LOCATION_TYPE.OTHER:
            otherValue++;
            break;
          default:
            noGPS++;
            break;
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
    const raw = await AsyncStorage.getItem(this.WFH_TODAY);
    const item = raw ? {...JSON.parse(raw), ...results} : results;
    await AsyncStorage.setItem(this.WFH_TODAY, JSON.stringify(item));
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