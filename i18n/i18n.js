import I18n from 'react-native-i18n';
import th from './locales/th';
import en from './locales/en';
import ma from './locales/ma';
import lo from './locales/lo';
import km from './locales/km';
import id from './locales/id';

I18n.fallbacks = true;
 
I18n.translations = {
  th,
  en,
  // ma,
  // lo,
  // km,
  // id
};
 
export default I18n;