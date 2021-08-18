import axios from 'axios'

export type coeCheckingType = {
  coeNo: string
  rfNo: string
}

const COE_API = 'https://motsapi.consular.go.th/main/checkcoe'

export const coeChecking = async ({ coeNo, rfNo }: coeCheckingType): Promise<boolean> => {
  const { data } = await axios.get(COE_API, {
    params: {
      coeNo: `'${coeNo}'`,
      rfNo: `'${rfNo}'`,
    },
  })

  return data
}
