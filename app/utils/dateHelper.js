export const getTextFromDate = createdAt => {
  const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const today = new Date()
  const todayStr = today.toJSON().slice(0, 10)

  const yesterday = new Date(today.setDate(today.getDate() - 1))
  const yesterdayStr = yesterday.toJSON().slice(0, 10)

  const date = createdAt.slice(0, 10)
  const time = createdAt.slice(11)

  const month = Months[parseInt(date.slice(5, 7), 10) - 1]
  let day = parseInt(date.slice(8, 10), 10)

  let suffix
  if (day % 10 === 1) {
    suffix = 'st'
  } else if (day % 10 === 2) {
    suffix = 'nd'
  } else if (day % 10 === 3) {
    suffix = 'rd'
  } else {
    suffix = 'th'
  }

  day = `${day}${suffix}`

  let dateStr

  if (date === yesterdayStr) {
    dateStr = 'yesterday'
  } else if (date === todayStr) {
    dateStr = ''
  } else if (date.slice(0, 4) === todayStr.slice(0, 4)) {
    dateStr = `${month} ${day}`
  } else {
    dateStr = `${month} ${day}, ${date.slice(0, 4)}`
  }

  dateStr += ` ${time.slice(0, 5)}`

  return dateStr
}
