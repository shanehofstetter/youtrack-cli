// tslint:disable
import {Moment} from "moment";

const moment = require('moment');

const formats: { [key: string]: string } = {
    "ar-SA": "DD/MM/YY",
    "bg-BG": "DD.M.YYYY",
    "ca-ES": "DD/MM/YYYY",
    "cs-CZ": "D.M.YYYY",
    "zh-TW": "YYYY/M/D",
    "da-DK": "DD-MM-YYYY",
    "de-DE": "DD.MM.YYYY",
    "el-GR": "D/M/YYYY",
    "en-US": "M/D/YYYY",
    "fi-FI": "D.M.YYYY",
    "fr-FR": "DD/MM/YYYY",
    "he-IL": "DD/MM/YYYY",
    "hu-HU": "YYYY. MM. DD.",
    "is-IS": "D.M.YYYY",
    "it-IT": "DD/MM/YYYY",
    "ja-JP": "YYYY/MM/DD",
    "ko-KR": "YYYY-MM-DD",
    "nl-NL": "D-M-YYYY",
    "nb-NO": "DD.MM.YYYY",
    "pl-PL": "YYYY-MM-DD",
    "pt-BR": "D/M/YYYY",
    "ro-RO": "DD.MM.YYYY",
    "ru-RU": "DD.MM.YYYY",
    "hr-HR": "D.M.YYYY",
    "sk-SK": "D. M. YYYY",
    "sq-AL": "YYYY-MM-DD",
    "sv-SE": "YYYY-MM-DD",
    "th-TH": "D/M/YYYY",
    "tr-TR": "DD.MM.YYYY",
    "ur-PK": "DD/MM/YYYY",
    "id-ID": "DD/MM/YYYY",
    "uk-UA": "DD.MM.YYYY",
    "be-BY": "DD.MM.YYYY",
    "sl-SI": "D.M.YYYY",
    "et-EE": "D.MM.YYYY",
    "lv-LV": "YYYY.MM.DD.",
    "lt-LT": "YYYY.MM.DD",
    "fa-IR": "MM/DD/YYYY",
    "vi-VN": "DD/MM/YYYY",
    "hy-AM": "DD.MM.YYYY",
    "az-Latn-AZ": "DD.MM.YYYY",
    "eu-ES": "YYYY/MM/DD",
    "mk-MK": "DD.MM.YYYY",
    "af-ZA": "YYYY/MM/DD",
    "ka-GE": "DD.MM.YYYY",
    "fo-FO": "DD-MM-YYYY",
    "hi-IN": "DD-MM-YYYY",
    "ms-MY": "DD/MM/YYYY",
    "kk-KZ": "DD.MM.YYYY",
    "ky-KG": "DD.MM.YY",
    "sw-KE": "M/D/YYYY",
    "uz-Latn-UZ": "DD/MM YYYY",
    "tt-RU": "DD.MM.YYYY",
    "pa-IN": "DD-MM-YY",
    "gu-IN": "DD-MM-YY",
    "ta-IN": "DD-MM-YYYY",
    "te-IN": "DD-MM-YY",
    "kn-IN": "DD-MM-YY",
    "mr-IN": "DD-MM-YYYY",
    "sa-IN": "DD-MM-YYYY",
    "mn-MN": "YY.MM.DD",
    "gl-ES": "DD/MM/YY",
    "kok-IN": "DD-MM-YYYY",
    "syr-SY": "DD/MM/YYYY",
    "dv-MV": "DD/MM/YY",
    "ar-IQ": "DD/MM/YYYY",
    "zh-CN": "YYYY/M/D",
    "de-CH": "DD.MM.YYYY",
    "en-GB": "DD/MM/YYYY",
    "es-MX": "DD/MM/YYYY",
    "fr-BE": "D/MM/YYYY",
    "it-CH": "DD.MM.YYYY",
    "nl-BE": "D/MM/YYYY",
    "nn-NO": "DD.MM.YYYY",
    "pt-PT": "DD-MM-YYYY",
    "sr-Latn-CS": "D.M.YYYY",
    "sv-FI": "D.M.YYYY",
    "az-Cyrl-AZ": "DD.MM.YYYY",
    "ms-BN": "DD/MM/YYYY",
    "uz-Cyrl-UZ": "DD.MM.YYYY",
    "ar-EG": "DD/MM/YYYY",
    "zh-HK": "D/M/YYYY",
    "de-AT": "DD.MM.YYYY",
    "en-AU": "D/MM/YYYY",
    "es-ES": "DD/MM/YYYY",
    "fr-CA": "YYYY-MM-DD",
    "sr-Cyrl-CS": "D.M.YYYY",
    "ar-LY": "DD/MM/YYYY",
    "zh-SG": "D/M/YYYY",
    "de-LU": "DD.MM.YYYY",
    "en-CA": "DD/MM/YYYY",
    "es-GT": "DD/MM/YYYY",
    "fr-CH": "DD.MM.YYYY",
    "ar-DZ": "DD-MM-YYYY",
    "zh-MO": "D/M/YYYY",
    "de-LI": "DD.MM.YYYY",
    "en-NZ": "D/MM/YYYY",
    "es-CR": "DD/MM/YYYY",
    "fr-LU": "DD/MM/YYYY",
    "ar-MA": "DD-MM-YYYY",
    "en-IE": "DD/MM/YYYY",
    "es-PA": "MM/DD/YYYY",
    "fr-MC": "DD/MM/YYYY",
    "ar-TN": "DD-MM-YYYY",
    "en-ZA": "YYYY/MM/DD",
    "es-DO": "DD/MM/YYYY",
    "ar-OM": "DD/MM/YYYY",
    "en-JM": "DD/MM/YYYY",
    "es-VE": "DD/MM/YYYY",
    "ar-YE": "DD/MM/YYYY",
    "en-029": "MM/DD/YYYY",
    "es-CO": "DD/MM/YYYY",
    "ar-SY": "DD/MM/YYYY",
    "en-BZ": "DD/MM/YYYY",
    "es-PE": "DD/MM/YYYY",
    "ar-JO": "DD/MM/YYYY",
    "en-TT": "DD/MM/YYYY",
    "es-AR": "DD/MM/YYYY",
    "ar-LB": "DD/MM/YYYY",
    "en-ZW": "M/D/YYYY",
    "es-EC": "DD/MM/YYYY",
    "ar-KW": "DD/MM/YYYY",
    "en-PH": "M/D/YYYY",
    "es-CL": "DD-MM-YYYY",
    "ar-AE": "DD/MM/YYYY",
    "es-UY": "DD/MM/YYYY",
    "ar-BH": "DD/MM/YYYY",
    "es-PY": "DD/MM/YYYY",
    "ar-QA": "DD/MM/YYYY",
    "es-BO": "DD/MM/YYYY",
    "es-SV": "DD/MM/YYYY",
    "es-HN": "DD/MM/YYYY",
    "es-NI": "DD/MM/YYYY",
    "es-PR": "DD/MM/YYYY",
    "am-ET": "D/M/YYYY",
    "tzm-Latn-DZ": "DD-MM-YYYY",
    "iu-Latn-CA": "D/MM/YYYY",
    "sma-NO": "DD.MM.YYYY",
    "mn-Mong-CN": "YYYY/M/D",
    "gd-GB": "DD/MM/YYYY",
    "en-MY": "D/M/YYYY",
    "prs-AF": "DD/MM/YY",
    "bn-BD": "DD-MM-YY",
    "wo-SN": "DD/MM/YYYY",
    "rw-RW": "M/D/YYYY",
    "qut-GT": "DD/MM/YYYY",
    "sah-RU": "MM.DD.YYYY",
    "gsw-FR": "DD/MM/YYYY",
    "co-FR": "DD/MM/YYYY",
    "oc-FR": "DD/MM/YYYY",
    "mi-NZ": "DD/MM/YYYY",
    "ga-IE": "DD/MM/YYYY",
    "se-SE": "YYYY-MM-DD",
    "br-FR": "DD/MM/YYYY",
    "smn-FI": "D.M.YYYY",
    "moh-CA": "M/D/YYYY",
    "arn-CL": "DD-MM-YYYY",
    "ii-CN": "YYYY/M/D",
    "dsb-DE": "D. M. YYYY",
    "ig-NG": "D/M/YYYY",
    "kl-GL": "DD-MM-YYYY",
    "lb-LU": "DD/MM/YYYY",
    "ba-RU": "DD.MM.YY",
    "nso-ZA": "YYYY/MM/DD",
    "quz-BO": "DD/MM/YYYY",
    "yo-NG": "D/M/YYYY",
    "ha-Latn-NG": "D/M/YYYY",
    "fil-PH": "M/D/YYYY",
    "ps-AF": "DD/MM/YY",
    "fy-NL": "D-M-YYYY",
    "ne-NP": "M/D/YYYY",
    "se-NO": "DD.MM.YYYY",
    "iu-Cans-CA": "D/M/YYYY",
    "sr-Latn-RS": "D.M.YYYY",
    "si-LK": "YYYY-MM-DD",
    "sr-Cyrl-RS": "D.M.YYYY",
    "lo-LA": "DD/MM/YYYY",
    "km-KH": "YYYY-MM-DD",
    "cy-GB": "DD/MM/YYYY",
    "bo-CN": "YYYY/M/D",
    "sms-FI": "D.M.YYYY",
    "as-IN": "DD-MM-YYYY",
    "ml-IN": "DD-MM-YY",
    "en-IN": "DD-MM-YYYY",
    "or-IN": "DD-MM-YY",
    "bn-IN": "DD-MM-YY",
    "tk-TM": "DD.MM.YY",
    "bs-Latn-BA": "D.M.YYYY",
    "mt-MT": "DD/MM/YYYY",
    "sr-Cyrl-ME": "D.M.YYYY",
    "se-FI": "D.M.YYYY",
    "zu-ZA": "YYYY/MM/DD",
    "xh-ZA": "YYYY/MM/DD",
    "tn-ZA": "YYYY/MM/DD",
    "hsb-DE": "D. M. YYYY",
    "bs-Cyrl-BA": "D.M.YYYY",
    "tg-Cyrl-TJ": "DD.MM.YY",
    "sr-Latn-BA": "D.M.YYYY",
    "smj-NO": "DD.MM.YYYY",
    "rm-CH": "DD/MM/YYYY",
    "smj-SE": "YYYY-MM-DD",
    "quz-EC": "DD/MM/YYYY",
    "quz-PE": "DD/MM/YYYY",
    "hr-BA": "D.M.YYYY.",
    "sr-Latn-ME": "D.M.YYYY",
    "sma-SE": "YYYY-MM-DD",
    "en-SG": "D/M/YYYY",
    "ug-CN": "YYYY-M-D",
    "sr-Cyrl-BA": "D.M.YYYY",
    "es-US": "M/D/YYYY",
};

export function getLocaleDateFormat(locale: string): string {
    locale = locale.replace("_", '-');
    return formats[locale] || 'DD/MM/YYYY';
}

export function parseDateWithLocale(date: string, locale: string): Moment {
    return moment(date, getLocaleDateFormat(locale));
}

export function toLocalizedDateString(date: Moment | Date, locale: string): string {
    if ("format" in date) {
        return date.format(getLocaleDateFormat(locale));
    }
    return moment(date).format(getLocaleDateFormat(locale));
}
