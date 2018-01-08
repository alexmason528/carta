import moment from 'moment'
import enTranslationMessages from 'translations/en.json'
import nlTranslationMessages from 'translations/nl.json'

const translations = {
  en: enTranslationMessages,
  nl: nlTranslationMessages,
}

export const getTextFromDate = (createdAt, locale = 'en') => {
  moment.locale(locale)
  const today = translations[locale]['carta.today']
  const yesterday = translations[locale]['carta.yesterday']

  if (
    moment()
      .startOf('day')
      .toString() ===
    moment(createdAt)
      .startOf('day')
      .toString()
  ) {
    return `${today} ${moment(createdAt)
      .format('H:mm')
      .replace('.', '')}`
  } else if (
    moment()
      .subtract(1, 'day')
      .startOf('day')
      .toString() ===
    moment(createdAt)
      .startOf('day')
      .toString()
  ) {
    return `${yesterday} ${moment(createdAt)
      .format('H:mm')
      .replace('.', '')}`
  } else if (moment().year() === moment(createdAt).year()) {
    return moment(createdAt)
      .format('D MMM H:mm')
      .replace('.', '')
  }
  return moment(createdAt)
    .format('D MMM YYYY H:mm')
    .replace('.', '')
}
