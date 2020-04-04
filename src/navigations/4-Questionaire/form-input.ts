export const dataInputTable: DataInput[] = [
  {
    id: 'one_uri_symp',
    name: 'data:covid:one_uri_symp',
    title: 'ท่านมีอาการดังต่อไปนี้หรือไม่ ?',
    subtitle: 'กรุณาเลือกอาการที่ตรงกับคุณ',
    dataType: 'String',
    inputType: 'MuliSelect',
    defaultValue: [],
    options: [
      { label: 'มีไข้', value: 'one_uri_symp1' },
      { label: 'ไอ', value: 'one_uri_symp2' },
      { label: 'เจ็บคอ', value: 'one_uri_symp3' },
      { label: 'เหนื่อยหอบผิดปกติ', value: 'one_uri_symp4' },
      { label: 'อาเจียน', value: 'one_uri_symp5' },
      { label: 'ไม่มีอาการข้างต้น', value: 'none' },
    ],
  },
  {
    id: 'travel_risk_country',
    title: 'ได้เดินทางไปต่างประเทศในช่วง 14 วันก่อน',
    name: 'data:travel:travel_risk_country',
    dataType: 'Boolean',
    inputType: 'Select',
    defaultValue: [],
    options: [
      { label: 'ได้ไปต่างประเทศ', value: true },
      { label: 'ไม่ได้ไปต่างประเทศ', value: false },
    ],
  },
  {
    id: 'covid19_contact',
    title:
      'มีประวัติอยู่ใกล้ชิดกับผู้ป่วยยืนยัน COVID-19 (ใกล้กว่า 1 เมตร นานเกิน 5 นาที) ในช่วง 14 วันก่อนหรือไปสถานที่เสี่ยง',
    additionalUrl: 'https://workpointnews.com/2020/03/25/30the-location/',
    name: 'data:community:covid19_contact',
    dataType: 'Boolean',
    inputType: 'Select',
    defaultValue: [],
    options: [
      { label: 'มี', value: true },
      { label: 'ไม่มี', value: false },
    ],
  },
  {
    id: 'close_risk_country',
    title: 'มีบุคคลในบ้านเดินทางไปต่างประเทศ ในช่วง 14 วันก่อน',
    name: 'data:community:close_risk_country',
    dataType: 'Boolean',
    inputType: 'Select',
    defaultValue: [],
    options: [
      { label: 'มี', value: true },
      { label: 'ไม่มี', value: false },
    ],
  },
  {
    id: 'int_contact',
    title: 'ประกอบอาชีพใกล้ชิดกับชาวต่างชาติ',
    name: 'data:community:int_contact',
    dataType: 'Boolean',
    inputType: 'Select',
    defaultValue: [],
    options: [
      { label: 'ใช่', value: true },
      { label: 'ไม่ใช่', value: false },
    ],
  },
  {
    id: 'med_prof',
    title: 'เป็นบุคลากรทางการแพทย์',
    name: 'data:community:med_prof',
    dataType: 'Boolean',
    inputType: 'Select',
    defaultValue: [],
    options: [
      { label: 'ใช่', value: true },
      { label: 'ไม่ใช่', value: false },
    ],
  },
  {
    id: 'close_con',
    title:
      'มีผู้ใกล้ชิดป่วยเป็นไข้หวัดพร้อมกัน มากกว่า 5 คน ในช่วง 14 วันก่อน',
    name: 'data:community:close_con',
    dataType: 'Boolean',
    inputType: 'Select',
    defaultValue: [],
    options: [
      { label: 'มี', value: true },
      { label: 'ไม่มี', value: false },
    ],
  },
]
