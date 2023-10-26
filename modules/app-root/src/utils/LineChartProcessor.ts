import { Dictionary } from '@reduxjs/toolkit'
import { IRowData, TRowDataProperty } from './SelectedProcessor/type'
import { IDataInfo } from '../models'

/**
 * {"channelId | videoId": {"date": IRowData }}
 */
export type TLineChart = Dictionary<Dictionary<IRowData>>

class LineChartProcessorBase {
  sortByDate = (params: TRowDataProperty[]) => {
    const temp = params.slice().sort((a, b) => {
      const aa = a.toString()
      const bb = b.toString()
      return aa > bb ? 1 : aa < bb ? -1 : 0
    })
    return temp
  }

  mapSingle = (params: TRowDataProperty[], info: Dictionary<IDataInfo>): IRowData => ({
    id: params[0],
    date: params[1],
    views: params[2],
    estimatedMinutesWatched: parseFloat(params[3] + '') / 60,
    estimatedRevenue: params[4],
    title: info[params[0]]?.Snippet.Title ?? params[0].toString()
  })

  mapLineChart = (params: TRowDataProperty[][], info: Dictionary<IDataInfo>): TLineChart => {
    return params.reduce((prev, cur) => {
      if (!prev[cur[0]]) prev[cur[0]] = {}
      const item = prev[cur[0]]
      if (item) item[cur[1]] = this.mapSingle(cur, info)
      return prev
    }, {} as TLineChart)
  }

  getDates = (params: TRowDataProperty[][]) => {
    const map = params.reduce((prev, cur) => {
      prev.add(cur[1])
      return prev
    }, new Set<TRowDataProperty>())
    return this.sortByDate(Array.from(map))
  }
}

const LineChartProcessor = new LineChartProcessorBase()
export default LineChartProcessor
