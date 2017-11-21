import moment from 'moment'
import enTranslationMessages from 'translations/en.json'
import nlTranslationMessages from 'translations/nl.json'

export const getTextFromDate = (createdAt, locale = 'en') => {
  moment.locale(locale)
  const today = (locale === 'en') ? enTranslationMessages['carta.today'] : nlTranslationMessages['carta.today']
  const yesterday = (locale === 'en') ? enTranslationMessages['carta.yesterday'] : nlTranslationMessages['carta.yesterday']
  if (moment().startOf('day').toString() === moment(createdAt).startOf('day').toString()) {
    return `${today} ${moment(createdAt).format('H:mm').replace('.', '')}`
  } else if (moment().subtract(1, 'day').startOf('day').toString() === moment(createdAt).startOf('day').toString()) {
    return `${yesterday} ${moment(createdAt).format('H:mm').replace('.', '')}`
  } else if (moment().year() === moment(createdAt).year()) {
    return moment(createdAt).format('D MMM H:mm').replace('.', '')
  }
  return moment(createdAt).format('D MMM YYYY H:mm').replace('.', '')
}
