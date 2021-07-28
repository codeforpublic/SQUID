import I18n from '../../../i18n/i18n'

export const getDataInputTable = () => [
  {
    id: 'one_uri_symp',
    name: 'data:covid:one_uri_symp',
    title: I18n.t('any_symptom'),
    subtitle: I18n.t('q_any_symptom'),
    dataType: 'String',
    inputType: 'MultiSelect',
    defaultValue: [],
    options: [
      { label: I18n.t('high_fever'), value: 'fever' },
      { label: I18n.t('cough'), value: 'one_uri_symp_1' },
      { label: I18n.t('sore_throat'), value: 'one_uri_symp_2' },
      { label: I18n.t('shortness_of_breath'), value: 'one_uri_symp_3' },
      { label: I18n.t('vomit'), value: 'one_uri_symp_4' },
      { label: I18n.t('none_of_above'), value: 'none', clearOther: true },
    ],
  },
  {
    id: 'travel_risk_country',
    title: I18n.t('travel_abroad'),
    name: 'data:travel:travel_risk_country',
    dataType: 'Boolean',
    inputType: 'Select',
    options: [
      { label: I18n.t('went_oversea'), value: true },
      { label: I18n.t('didnt_go_oversea'), value: false },
    ],
  },
  {
    id: 'covid19_contact',
    title: I18n.t('get_near_covid_risk_ppl_past_14_days'),
    name: 'data:community:covid19_contact',
    dataType: 'Boolean',
    inputType: 'MultiSelect',
    defaultValue: [],
    options: [
      {
        label: I18n.t('more_than_5_ppl_with_fever_around_you'),
        value: 'close_con',
      },
      {
        label: I18n.t('just_back_from_abroad_person_at_home'),
        value: 'close_risk_country',
      },
      {
        label: I18n.t('closed_contact_with_covid19_confirmed_case'),
        value: 'covid19_contact',
      },
      {
        label: I18n.t('none_of_history_above'),
        value: 'none',
        clearOther: true,
      },
    ],
  },
  {
    id: 'int_contact',
    title: I18n.t('occupation_involving_foreigners'),
    name: 'data:community:int_contact',
    dataType: 'Boolean',
    inputType: 'Select',
    options: [
      { label: I18n.t('yes'), value: true },
      { label: I18n.t('no'), value: false },
    ],
  },
  // {
  //   id: 'med_prof',
  //   title: I18n.t('is_medical_staff'),
  //   subtitle: 'คุณเป็นเป็นบุคลากรทางการแพทย์ ?',
  //   name: 'data:community:med_prof',
  //   dataType: 'Boolean',
  //   inputType: 'Select',
  //   options: [
  //     { label: I18n.t('yes'), value: true },
  //     { label: I18n.t('no'), value: false },
  //   ],
  // }
]

export type DataInput = ReturnType<typeof getDataInputTable>
