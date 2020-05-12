import I18n from 'react-native-i18n';
import th from './locales/th';
import en from './locales/en';
import ma from './locales/ma';

I18n.fallbacks = true;
 
I18n.translations = {
  th,
  en,
  ma
};
 
export default I18n;