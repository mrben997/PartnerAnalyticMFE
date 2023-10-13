import { Dictionary } from '@reduxjs/toolkit'
import { IRowData } from './type'

export interface ISelectMap {
  row: IRowData
  type: 'unit' | 'total'
  checked: boolean
  color?: string
  disabled?: boolean
}

type TMaping = Dictionary<ISelectMap>

export class SelectAccessor {
  colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119'
    // , '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
  ]
  maping: TMaping = {}
  max: number
  totalId: string
  constructor(rows: IRowData[], totalId: string) {
    this.max = this.colors.length
    this.totalId = totalId
    this.maping = this.getMaping(rows)
    console.log(this)
  }

  get rows(): IRowData[] {
    const arr = Array.from(Object.values(this.maping) as ISelectMap[])
    const index = arr.findIndex((item) => item.type === 'total')
    if (index !== -1) {
      const item = arr[index]
      arr.splice(index, 1)
      arr.unshift(item)
    }
    return arr.map((e) => e.row)
  }

  get colorActives(): string[] {
    const arr = Object.values(this.maping) as ISelectMap[]
    return arr.filter((e) => e && e.color).map((e) => e.color) as string[]
  }

  get idActives(): string[] {
    const arr = Object.keys(this.maping) as string[]
    return arr.filter((e) => this.maping[e]?.checked && this.maping[e]?.type === 'unit') as string[]
  }

  getMaping = (params: IRowData[]) => {
    const m = params.reduce((obj, cur) => {
      const data: ISelectMap = { row: cur, type: 'unit', checked: false }
      obj[cur.id] = data
      return obj
    }, {} as TMaping)
    m[this.totalId] = { row: this.calculatorTotal(), type: 'total', checked: false }
    return m
  }

  calculatorTotal = (): IRowData => {
    return this.rows.reduce((obj, cur) => {
      obj.views += cur.views
      obj.estimatedMinutesWatched += cur.estimatedMinutesWatched
      obj.estimatedRevenue += cur.estimatedRevenue
      return obj
    }, this.emptyRowTotal())
  }

  emptyRowTotal = () => ({
    id: this.totalId,
    title: 'Total',
    views: 0,
    estimatedMinutesWatched: 0,
    estimatedRevenue: 0
  })

  getUnusedColor = (id: string): string | undefined => {
    const select = this.maping[id]
    if (select && select.color) select.color
    if (this.colorActives.length === this.max) return
    return this.colors.find((color) => !this.colorActives.some((e) => e === color))
  }

  disableCheckbox = () => {
    const isDisabled = this.colorActives.length === this.max
    let ids = Array.from(Object.keys(this.maping) as string[])
    ids = ids.filter((e) => e !== this.totalId)
    this.maping = ids.reduce((prev, cur) => {
      const elm = prev[cur] as ISelectMap
      if (!elm.color) {
        if (isDisabled) prev[cur] = { ...elm, disabled: true }
        else prev[cur] = { row: elm.row, type: elm.type, checked: elm.checked }
      }
      return prev
    }, this.maping)
  }

  cleanCheckbox = () => {
    const arr = Array.from(Object.keys(this.maping) as string[])
    return arr.reduce((prev, cur) => {
      const elm = prev[cur] as ISelectMap
      prev[cur] = { row: elm.row, type: elm.type, checked: false }
      return prev
    }, this.maping)
  }

  // event
  selectUnitCheckbox = (id: string, checked: boolean) => {
    const elm = this.maping[id]
    if (!elm) return
    if (!checked || elm.type === 'total') {
      this.maping[id] = { row: elm.row, type: elm.type, checked: checked }
    } else {
      const color = this.getUnusedColor(id)
      this.maping[id] = { row: elm.row, type: elm.type, checked: checked, color } as ISelectMap
    }
    this.disableCheckbox()
  }

  selectAllCheckbox = (checked: boolean) => {
    console.log(checked)

    if (!checked) return this.cleanCheckbox()
    let amount = 0
    let ids = Array.from(Object.keys(this.maping) as string[])
    ids = ids.filter((e) => e !== this.totalId)
    ids.forEach((id) => {
      const elm = this.maping[id] as ISelectMap
      if (!elm.checked && amount < this.max) {
        this.maping[id] = { ...elm, checked: true, color: this.getUnusedColor(id) }
      }
      amount++
    })
    this.disableCheckbox()
  }
}

export default SelectAccessor
