import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ correct import
import '../node_modules/jquery/dist/jquery.min.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/react-datepicker/dist/react-datepicker.min.js';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/index';
import './fonts/helveticaneue/HelveticaNeue.ttf';
import { BrowserRouter } from 'react-router-dom';
import './http/http-interceptor';
import i18next from 'i18next';
import englishContent from './translations/en.json';
import arabicContent from './translations/ar.json';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// i18n setup
// const initOptions = {
//   interpolation: { escapeValue: false },
//   lng: 'en',
//   resources: {
//     en: { translation: englishContent },
//     ar: { translation: arabicContent },
//   },
// };

const initOptions = {
  interpolation: { escapeValue: false },

  // ✅ IMPORTANT: take from localStorage first
  lng: localStorage.getItem('appLanguage') || 'en',

  fallbackLng: 'en',

  resources: {
    en: { translation: englishContent },
    ar: { translation: arabicContent },
  },
};

i18next.use(LanguageDetector).use(initReactI18next).init(initOptions);

// ✅ Use React 18 render method
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

reportWebVitals();
