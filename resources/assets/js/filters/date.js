import * as moment from 'moment'

export const date = (value) => {
  return moment(value).format('dddd, Do MMMM YYYY, HH:mm')
}

export const dateShort = (value) => {
  return moment(value).format('ddd DD-MMM., HH:mm')
}

export const dateDiff = (value) => {
  return moment(value).fromNow()
}

// return name of weekday by numbers 0 to 6, where number 0 is Sunday
export const weekdayName = (value) => {
  let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return weekdays[value]
}

export const time = (value) => {
  // show the time part of a date value
  let tm
  if (value.length <= 8) {
    tm = moment(value, 'HH:mm:ss')
  } else {
    tm = moment(value)
  }
  return tm.format('HH:mm')
}
