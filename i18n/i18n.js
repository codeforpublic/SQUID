import I18n from 'react-native-i18n';
import en from './locales/th';
import fr from './locales/en';
//import ma from './locales/ma';

I18n.fallbacks = true;
 
I18n.translations = {
  en,
  fr
};
 
export default I18n;