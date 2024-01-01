import I18n from 'i18n-js';

import en from './en';
import ar from './ar';

I18n.fallbacks = true;

I18n.translations = {
  en,
  ar,
};

export default I18n;
