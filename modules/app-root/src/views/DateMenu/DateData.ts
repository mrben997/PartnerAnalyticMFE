export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fullMonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function getDaysInMonth(m: number, y: number) {
  return m === 2 ? (y & 3 || (!(y % 25) && y & 15) ? 28 : 29) : 30 + ((m + (m >> 3)) & 1)
}
const maxDate = 3
const delayDate = (date1: Date, date2: Date, amount: number) => {
  date1 = new Date(date1.setDate(date1.getDate() + amount))
  date2 = new Date(date2.setDate(date2.getDate() + amount))
  return [date1, date2]
}
export const ToRangeDate = (range: Date[]) => {
  if (range.some((x) => !x)) {
    return ''
  }
  const day1 = range[0].getDate()
  const month1 = monthLabels[range[0].getMonth()]
  const year1 = range[0].getFullYear()

  const day2 = range[1].getDate()
  const month2 = monthLabels[range[1].getMonth()]
  const year2 = range[1].getFullYear()

  const tmpYear = year1 === year2 ? '' : `,${year1}`
  return `${month1} ${day1}${tmpYear} - ${month2} ${day2},${year2}`
}
export interface IDateOption {
  GetName: () => string
  GetValue: () => Date[]
}
const currentYear = new Date().getFullYear()
const generateName = (date: Date) => {
  const year = date.getFullYear()
  return `${fullMonthLabels[date.getMonth()]}${year === currentYear ? '' : '-' + year}`
}

export const DateOptions: IDateOption[] = [
  {
    GetName: () => 'Last 7 days',
    GetValue: () => {
      const date = new Date()
      const tmps = [new Date(date.setDate(date.getDate() - 6)), new Date()]
      return delayDate(tmps[0], tmps[1], -maxDate)
    }
  },
  {
    GetName: () => 'Last 28 days',
    GetValue: () => {
      const date = new Date()
      const tmps = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 27), date]
      return delayDate(tmps[0], tmps[1], -maxDate)
    }
  },
  {
    GetName: () => 'Last 90 days',
    GetValue: () => {
      const date = new Date()
      const tmps = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 89), date]
      return delayDate(tmps[0], tmps[1], -maxDate)
    }
  },
  {
    GetName: () => 'Last 365 days',
    GetValue: () => {
      const date = new Date()
      const tmps = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 364), date]
      return delayDate(tmps[0], tmps[1], -maxDate)
    }
  },
  {
    GetName: () => new Date().getFullYear() + '',
    GetValue: () => {
      const date = new Date()
      return [new Date(date.getFullYear(), 0, 1), new Date(date.getFullYear(), 11, 30)]
    }
  },
  {
    GetName: () => new Date().getFullYear() - 1 + '',
    GetValue: () => {
      const date = new Date()
      return [new Date(date.getFullYear() - 1, 0, 1), new Date(date.getFullYear() - 1, 11, 30)]
    }
  },
  {
    GetName: () => generateName(new Date()),
    GetValue: () => {
      const date = new Date()
      const month = date.getMonth()
      const year = date.getFullYear()
      return [new Date(year, month, 1), new Date(year, month, getDaysInMonth(month + 1, year))]
    }
  },
  {
    GetName: () => generateName(new Date(new Date().setMonth(new Date().getMonth() - 1))),
    GetValue: () => {
      let date = new Date()
      date = new Date(date.setMonth(date.getMonth() - 1))
      const month = date.getMonth()
      const year = date.getFullYear()
      return [new Date(year, month, 1), new Date(year, month, getDaysInMonth(month + 1, year))]
    }
  },
  {
    GetName: () => generateName(new Date(new Date().setMonth(new Date().getMonth() - 2))),
    GetValue: () => {
      let date = new Date()
      date = new Date(date.setMonth(date.getMonth() - 2))
      const month = date.getMonth()
      const year = date.getFullYear()
      return [new Date(year, month, 1), new Date(year, month, getDaysInMonth(month + 1, year))]
    }
  },
  {
    GetName: () => 'Custom',
    GetValue: () => {
      return []
    }
  }
]
