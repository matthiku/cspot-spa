import * as moment from 'moment'

export const date = (value) => {
  return moment(value).format('dddd, Do MMMM YYYY, HH:mm')
}

export const dateShort = (value) => {
  return moment(value).format('ddd DD-MMM., HH:mm')
}

export const weekdayName = (value) => {
  let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return weekdays[value]
}

export const time = (value) => {
  let tm = moment(value)
  if (!tm.isValid()) {
    tm = moment(value, 'HH:mm:ss')
  }
  return tm.format('HH:mm')
}
