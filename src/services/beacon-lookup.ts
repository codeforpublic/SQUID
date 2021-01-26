import { beaconinfo as beaconInfo } from '../api'
import AsyncStorage from '@react-native-community/async-storage'

class BeaconLookup {
  public async getBeaconInfo(uuid: string, major: number, minor: number): Promise<any> {
    try {
      const response = await beaconInfo(uuid, major.toString(), minor.toString())
      AsyncStorage.setItem('beacon-location', response.name);
      return response
    } catch (error) {
      return null
    }
  }
}

export const beaconLookup = new BeaconLookup()
