import { totalColorDefault, totalIdDefault } from './constants'
import { IRowData, ISelectMap, TSelectedProcessorMaping } from './type'

export default class SelectedProcessorBase {
  colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe']
  max: number
  constructor() {
    this.max = this.colors.length
  }

  isTotalRow = (rowId: string) => totalIdDefault === rowId

  convertMaping = (params: IRowData[]) => {
    const m = params.reduce((obj, cur) => {
      const data: ISelectMap = { row: cur, type: 'unit', checked: false }
      obj[cur.id] = data
      return obj
    }, {} as TSelectedProcessorMaping)
    return m
  }

  convertMapingUnusedColor = (params: IRowData[]) => {
    const m = params.reduce((obj, cur) => {
      const color = this.getUnusedColor(cur.id as string, obj)
      const data: ISelectMap = { row: cur, type: 'unit', checked: false }
      if (color) data.color = color
      obj[cur.id] = data
      return obj
    }, {} as TSelectedProcessorMaping)
    return m
  }

  getIdActives(maping: TSelectedProcessorMaping, isTakeTotal?: boolean): string[] {
    let arr = Object.keys(maping) as string[]
    if (!isTakeTotal) arr = arr.filter((e) => maping[e]?.row.id !== totalIdDefault)
    return arr.filter((e) => maping[e]?.checked) as string[]
  }

  getColorActives = (maping: TSelectedProcessorMaping): string[] => {
    let arr = Object.keys(maping) as string[]
    arr = arr.filter((e) => e && maping[e]?.color && maping[e]?.row.id != totalIdDefault)
    return arr.map((e) => maping[e]?.color || '') as string[]
  }

  getUnusedColor = (id: string, maping: TSelectedProcessorMaping): string | undefined => {
    if (id === totalIdDefault) return totalColorDefault
    const select = maping[id]
    if (select && select.color) return
    const colors = this.getColorActives(maping)
    if (colors.length === this.max) return
    return this.colors.find((color) => !colors.some((e) => e === color))
  }

  disableCheckbox = (maping: TSelectedProcessorMaping) => {
    const isDisabled = this.getColorActives(maping).length === this.max
    let ids = Array.from(Object.keys(maping) as string[])
    ids = ids.filter((e) => e !== totalIdDefault)
    maping = ids.reduce((prev, cur) => {
      const elm = prev[cur] as ISelectMap
      if (!elm.color) {
        if (isDisabled) prev[cur] = { ...elm, disabled: true }
        else prev[cur] = { row: elm.row, type: elm.type, checked: elm.checked }
      }
      return prev
    }, maping)
  }

  cleanCheckbox = (_maping: TSelectedProcessorMaping) => {
    const maping = { ..._maping }
    const arr = Array.from(Object.keys(maping) as string[])
    arr.forEach((e) => {
      const item = maping[e]
      if (item && item.row.id !== totalIdDefault) maping[e] = { row: item.row, type: item.type, checked: false }
    })
    return maping
  }

  // event
  selectUnitCheckbox = (id: string, checked: boolean, _maping: TSelectedProcessorMaping) => {
    const maping = { ..._maping }
    const elm = maping[id]
    if (!elm) return maping
    const color = elm.row.id !== totalIdDefault ? this.getUnusedColor(id, maping) : totalColorDefault
    maping[id] = { row: elm.row, type: elm.type, checked: checked, color } as ISelectMap
    this.disableCheckbox(maping)
    return maping
  }

  selectAllCheckbox = (checked: boolean, _maping: TSelectedProcessorMaping) => {
    const maping = { ..._maping }
    if (!checked) return this.cleanCheckbox(maping)
    let amount = 0
    let ids = Array.from(Object.keys(maping) as string[])
    ids = ids.filter((e) => e !== totalIdDefault)
    ids.forEach((id) => {
      const elm = maping[id] as ISelectMap
      if (!elm.checked && amount < this.max) {
        maping[id] = { ...elm, checked: true, color: this.getUnusedColor(id, maping) }
      }
      amount++
    })
    this.disableCheckbox(maping)
    return maping
  }
}
