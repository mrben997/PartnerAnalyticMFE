import { faker } from '@faker-js/faker'
import { IDateOption } from '../../utils/type'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const FULL_MONTH_LABELS = [
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

class DateOptionBase {
  private maxDate = 3
  private currentYear = new Date().getFullYear()
  monthLabels: string[]
  fullMonthLabels: string[]
  data: IDateOption[]
  constructor() {
    this.initial()
  }

  private initial = () => {
    this.monthLabels = MONTH_LABELS
    this.fullMonthLabels = FULL_MONTH_LABELS
    this.data = [
      { id: faker.database.mongodbObjectId(), title: 'Last 7 days', value: this.getLast7Days() },
      { id: faker.database.mongodbObjectId(), title: 'Last 28 days', value: this.getLast28Days() },
      { id: faker.database.mongodbObjectId(), title: 'Last 90 days', value: this.getLast90Days() },
      { id: faker.database.mongodbObjectId(), title: new Date().getFullYear() + '', value: this.getThisYear() },
      { id: faker.database.mongodbObjectId(), title: new Date().getFullYear() - 1 + '', value: this.getThisYear(1) },
      { id: faker.database.mongodbObjectId(), title: this.generateName(), value: this.getThisMonth() },
      { id: faker.database.mongodbObjectId(), title: this.generateName(1), value: this.getThisMonth(1) },
      { id: faker.database.mongodbObjectId(), title: this.generateName(2), value: this.getThisMonth(2) }
    ]
  }

  private delayDate = (date1: Date, date2: Date, amount: number) => {
    date1 = new Date(date1.setDate(date1.getDate() + amount))
    date2 = new Date(date2.setDate(date2.getDate() + amount))
    return [date1, date2]
  }

  private toString = (date1: Date, date2: Date) => {
    return [date1.toLocaleString(), date2.toLocaleString()]
  }

  private generateName = (subtraction: number = 0) => {
    let date = new Date()
    if (subtraction > 0) date = new Date(date.setMonth(date.getMonth() - subtraction))
    const year = date.getFullYear()
    return `${FULL_MONTH_LABELS[date.getMonth()]}${year === this.currentYear ? '' : '-' + year}`
  }

  private getDaysInMonth = (m: number, y: number) => {
    return m === 2 ? (y & 3 || (!(y % 25) && y & 15) ? 28 : 29) : 30 + ((m + (m >> 3)) & 1)
  }

  toRangeDate = (range: string[]) => {
    if (range.length < 1 || range.some((x) => !x)) return ''

    const date1 = new Date(range[0])
    const date2 = new Date(range[1])

    const day1 = date1.getDate()
    const month1 = this.monthLabels[date1.getMonth()]
    const year1 = date1.getFullYear()

    const day2 = date2.getDate()
    const month2 = this.monthLabels[date2.getMonth()]
    const year2 = date2.getFullYear()

    const tmpYear = year1 === year2 ? '' : `,${year1}`
    return `${month1} ${day1}${tmpYear} - ${month2} ${day2},${year2}`
  }

  getLast7Days = () => {
    const date = new Date()
    const tmps = [new Date(date.setDate(date.getDate() - 6)), new Date()]
    const [d1, d2] = this.delayDate(tmps[0], tmps[1], -this.maxDate)
    return this.toString(d1, d2)
  }

  getLast28Days = () => {
    const date = new Date()
    const tmps = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 27), date]
    const [d1, d2] = this.delayDate(tmps[0], tmps[1], -this.maxDate)
    return this.toString(d1, d2)
  }

  getLast90Days = () => {
    const date = new Date()
    const tmps = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 89), date]
    const [d1, d2] = this.delayDate(tmps[0], tmps[1], -this.maxDate)
    return this.toString(d1, d2)
  }

  getLast365Days = () => {
    const date = new Date()
    const tmps = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 364), date]
    const [d1, d2] = this.delayDate(tmps[0], tmps[1], -this.maxDate)
    return this.toString(d1, d2)
  }

  getThisYear = (subtraction: number = 0) => {
    const date = new Date()
    let year = date.getFullYear()
    if (subtraction > 0) year -= subtraction
    return this.toString(new Date(year, 0, 1), new Date(year, 11, 30))
  }

  getThisMonth = (subtraction: number = 0) => {
    let date = new Date()
    if (subtraction > 0) date = new Date(date.setMonth(date.getMonth() - subtraction))
    const month = date.getMonth()
    const year = date.getFullYear()
    return this.toString(new Date(year, month, 1), new Date(year, month, this.getDaysInMonth(month + 1, year)))
  }
}
const DateOption = new DateOptionBase()
export default DateOption
