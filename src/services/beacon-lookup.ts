import { beaconinfo } from '../api'
import AsyncStorage from '@react-native-community/async-storage'

class BeaconLookup {
  public async getBeaconInfo(
    uuid: string,
    major: number,
    minor: number,
  ): Promise<string> {

    try {
      const response = await beaconinfo(uuid, major.toString(), minor.toString())
      const { anonymousId, name } = response

      AsyncStorage.setItem('beacon-location', name)
      return anonymousId
    } catch (error) {
      return ''
    }

  }
}

export const beaconLookup = new BeaconLookup()
