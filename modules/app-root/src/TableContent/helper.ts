import { ar, faker } from '@faker-js/faker'
import { IMapSelected, IMapSelecteds, IRowData } from './type'
import { Dictionary } from '@reduxjs/toolkit'
import { idDefault } from 'csmfe'

class HelperBase {
  colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe']

  inititalMap = (params: IRowData[]) => {
    return params.reduce((obj, cur): Dictionary<IMapSelected> => {
      const data: IMapSelected = { checked: false }
      obj[cur.id] = data
      return obj
    }, {})
  }

  toOrigin = (params: IMapSelecteds) => {
    const obj = { ...params }
    delete obj.map[idDefault]
    return params
  }

  convertMapSelectToColors = (params: IMapSelecteds) => {
    const arr = Object.values(params.map) as IMapSelected[]
    return arr.filter((e) => e && e.color).map((e) => e.color) as string[]
  }

  convertMapSelectToSelectedIds = (params: IMapSelecteds) => {
    const data = this.toOrigin(params)
    const ids = Object.keys(data.map) as string[]
    return ids.filter((e) => !!data.map[e]?.checked)
  }

  getUnusedColor = (id: string, params: IMapSelecteds): string | undefined => {
    if (id === idDefault) return
    const data = this.toOrigin(params)
    const select = data.map[id]
    if (select && select.color) select.color
    const colorActives = this.convertMapSelectToColors(data)
    if (data.max === colorActives.length) return
    const colorExist = new Set(colorActives)
    return data.colors.find((e) => !colorExist.has(e))
  }

  calculatorTotal = (params: IRowData[], initial: IRowData): IRowData => {
    return params.reduce((obj, cur) => {
      obj.views += cur.views
      obj.estimatedMinutesWatched += cur.estimatedMinutesWatched
      obj.estimatedRevenue += cur.estimatedRevenue
      return obj
    }, initial)
  }

  calculatorTotals = (params: IRowData[], initial: IRowData): IRowData[] => {
    return [this.calculatorTotal(params, initial), ...params]
  }

  getMapDisableStatusCheckbox = (params: IMapSelecteds): IMapSelecteds => {
    const cls = this.convertMapSelectToColors(params)
    const isDisabled = cls.length === params.max
    const arr = Array.from(Object.keys(params.map) as string[])
    const mapResult = arr.reduce((prev, cur) => {
      if (cur === idDefault) return prev
      const data = prev.map[cur] as IMapSelected
      if (!isDisabled) {
        prev.map[cur] = data.color ? { checked: data.checked, color: data.color } : { checked: data.checked }
      } else if (!data.color) {
        prev.map[cur] = { checked: false, disabled: true }
      }
      return prev
    }, params)
    return mapResult
  }

  cleanCheckbox = (params: IMapSelecteds): IMapSelecteds => {
    const arr = Array.from(Object.keys(params.map) as string[])
    const t = arr.reduce((prev, cur) => {
      prev.map[cur] = { checked: false }
      return prev
    }, params)
    // console.log(t)
    return t
  }

  selectUnitCheckbox = (params: IMapSelecteds, id: string, checked: boolean): IMapSelecteds => {
    if (!checked) {
      params.map[id] = { checked: checked }
    } else {
      const color = this.getUnusedColor(id, params)
      params.map[id] = { checked: checked, color }
    }
    return this.getMapDisableStatusCheckbox(params)
  }

  selectAllCheckbox = (params: IMapSelecteds, checked: boolean): IMapSelecteds => {
    if (!checked) return this.cleanCheckbox(params)
    let amount = 0
    const arr = Array.from(Object.keys(params.map) as string[])
    const mapResult = arr.reduce((prev, cur) => {
      if (params.map[cur]?.checked === false && amount < params.max && cur !== idDefault) {
        const color = prev.map[cur]?.color || this.getUnusedColor(cur, prev)
        if (prev.map[cur]) prev.map[cur] = color ? { color, checked: true } : { checked: true }
      }
      amount++
      return prev
    }, params)
    console.log(Object.keys(mapResult.map))

    return this.getMapDisableStatusCheckbox(mapResult)
  }
}
export const TableContentHelper = new HelperBase()
export default TableContentHelper
