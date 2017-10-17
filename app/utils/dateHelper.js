import moment from 'moment'

export const getTextFromDate = createdAt => {
  if (moment().startOf('day').toString() === moment(createdAt).startOf('day').toString()) {
    return `TODAY ${moment(createdAt).format('HH:MM')}`
  } else if (moment().subtract(1, 'day').startOf('day').toString() === moment(createdAt).startOf('day').toString()) {
    return `YESTERDAY ${moment(createdAt).format('HH:MM')}`
  } else if (moment().year() === moment(createdAt).year()) {
    return moment(createdAt).format('DD MMM HH:MM')
  }
  return moment(createdAt).format('DD MMM YYYY HH:MM')
}
