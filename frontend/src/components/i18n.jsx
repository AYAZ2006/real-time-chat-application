import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      english: {
        translation: {
          settings: "Settings",
          general: "General",
          account: "Accounts",
          notifications: "Notifications",
          personalizations: "Personalizations",
          chat_settings: "Chat Settings",
          help_support: "Help & Support",
          auto_text_corrector: "Auto Text Corrector",
          save: "Save Changes",
          settings_updated: "Settings updated successfully! ✅",
        },
      },
      hindi: {
        translation: {
          settings: "सेटिंग्स",
          general: "सामान्य",
          account: "खाते",
          notifications: "सूचनाएं",
          personalizations: "निजीकरण",
          chat_settings: "चैट सेटिंग्स",
          help_support: "मदद और समर्थन",
          auto_text_corrector: "स्वचालित पाठ सुधारक",
          save: "परिवर्तन सहेजें",
          settings_updated: "सेटिंग्स सफलतापूर्वक अपडेट हुईं! ✅",
        },
      },
      telugu: {
        translation: {
          settings: "సెట్టింగ్‌లు",
          general: "సాధారణ",
          account: "ఖాతాలు",
          notifications: "నోటిఫికేషన్లు",
          personalizations: "అనుకూలీకరణలు",
          chat_settings: "చాట్ సెట్టింగ్‌లు",
          help_support: "సహాయం & మద్దతు",
          auto_text_corrector: "ఆటో టెక్స్ట్ కరెక్టర్",
          save: "మార్పులను సేవ్ చేయండి",
          settings_updated: "సెట్టింగ్‌లు విజయవంతంగా నవీకరించబడ్డాయి! ✅",
        },
      },
      arabic: {
        translation: {
          settings: "الإعدادات",
          general: "عام",
          account: "الحسابات",
          notifications: "الإشعارات",
          personalizations: "التخصيصات",
          chat_settings: "إعدادات الدردشة",
          help_support: "المساعدة والدعم",
          auto_text_corrector: "مصصح النص التلقائي",
          save: "حفظ التغييرات",
          settings_updated: "تم تحديث الإعدادات بنجاح! ✅",
        },
      },
    },
    fallbackLng: "english",
    interpolation: { escapeValue: false },
  });

export default i18n;
