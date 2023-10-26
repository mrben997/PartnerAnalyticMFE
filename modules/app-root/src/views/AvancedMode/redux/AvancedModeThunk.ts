import { Graphql } from 'graphql-service-mfe'
import { Dictionary, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from 'OIDC-auth/Components/ApiAuthorization/AuthorizeService'
import { SetupCancel, calculateWatchTime } from '../../../redux/helper'
import { IDataInfo, TQueryParams } from '../../../models'
import store from '../../../redux'
import DateOption from '../../../utils/DateOption'
import MediaNetworkService from '../../../services/ComponentService'
import MetricOption from '../../../utils/MetricOption'
import KindOption, { TKindOptionType } from '../../../utils/KindOption'
import { IRowData, TRowDataProperty } from '../../../utils/SelectedProcessor/type'
import AnalyticService from '../../../services/AnalyticService'
import { totalIdDefault } from '../../../utils/SelectedProcessor'
import { ISelectMenu } from '../../../components/SelectMenu/type'
import LineChartProcessor, { TLineChart } from '../../../utils/LineChartProcessor'

interface IConfig extends Omit<TQueryParams, 'fields' | 'ids'> {
  dates: string[]
  kind: TKindOptionType
  ids?: string[]
}

const getLineChartData = (parmas: IConfig, signal?: AbortSignal) => {
  let query: TQueryParams = {
    fields: 'View, WatchTime, Money',
    kind: parmas.kind,
    affterDate: parmas.dates[0],
    beforeDate: parmas.dates[1],
    includeTotal: 'Date',
    sortBy: parmas.sortBy,
    time: 'Day',
    ids: (parmas.ids || []).join(',')
  }
  if (parmas.networkId) query = Object.assign({}, query, { networkId: parmas.networkId })
  return Graphql.Report.Query(Graphql.QReport.Query(query), { signal })
}

const getTableData = (parmas: IConfig, signal?: AbortSignal) => {
  let query: TQueryParams = {
    fields: 'View, WatchTime, Money',
    kind: parmas.kind,
    affterDate: parmas.dates[0],
    beforeDate: parmas.dates[1],
    includeTotal: 'None',
    take: 50,
    sortBy: parmas.sortBy
  }
  if (parmas?.ids?.length) query = Object.assign({}, query, { ids: (parmas.ids || []).join(',') })
  if (parmas.networkId) query = Object.assign({}, query, { networkId: parmas.networkId })
  return Graphql.Report.Query(Graphql.QReport.Query(query), { signal })
}

const getInfo = async (ids: string[], kindType: TKindOptionType, signal?: AbortSignal): Promise<Dictionary<IDataInfo>> => {
  switch (kindType) {
    case 'Video':
      return AnalyticService.GetVideoInfo(ids, signal).catch(() => ({}))
    case 'Channel':
    default:
      return AnalyticService.GetChannelInfo(ids, signal).catch(() => ({}))
  }
}

interface IReturn {
  tableData: IRowData[]
  lineChart: TLineChart
  dates: TRowDataProperty[]
}
export const fetchAvancedModeThunk = createAsyncThunk<IReturn>('fetchAvancedModeThunk', async (_, context) => {
  SetupCancel('fetchAvancedModeThunk', context.abort)

  const state = store.getState().AvancedModeSlice
  const dates = DateOption.toStringRequest(DateOption.data[state.dateIndex].value.map((e) => new Date(e)))
  const networkId = state.networks[state.networkIndex].id
  const kind = KindOption.data[state.tabIndex].id
  const sortBy = MetricOption.getSortString(MetricOption.data[state.metricIndex].id)
  const searchId = state.searchId

  const tableDataRes = await getTableData({ dates, networkId, kind, sortBy, ids: searchId ? [searchId] : [] }, context.signal)
  const table = calculateWatchTime((tableDataRes.query?.data ?? []) as (string | number)[][], 2)

  const ids = (tableDataRes.query?.data ?? []).slice(1).map((e) => e[0]) as string[]
  const info = await getInfo(ids, kind, context.signal)

  const lineChart = await getLineChartData({ dates, networkId, kind, sortBy, ids }, context.signal)
  return {
    tableData: table.map<IRowData>((e) => ({
      id: e[0].toString(),
      title: info[e[0]]?.Snippet.Title ?? e[0].toString(),
      views: e[1] as number,
      estimatedMinutesWatched: parseFloat(e[2] + '') / 60,
      estimatedRevenue: e[3] as number
    })),
    lineChart: LineChartProcessor.mapLineChart((lineChart.query?.data ?? []) as TRowDataProperty[][], info),
    dates: LineChartProcessor.getDates((lineChart.query?.data ?? []) as TRowDataProperty[][])
  }
})

interface IConfigReturn {
  networks: ISelectMenu[]
}
export const fetchAvancedModeConfigThunk = createAsyncThunk<IConfigReturn>('fetchAvancedModeConfigThunk', async (_, context) => {
  const networkRes = await MediaNetworkService.AllMediaNetwork(context.signal)
  const networks = networkRes.map<ISelectMenu>((e) => ({ id: e.Id, title: e.Name }))
  const roles = await authService.getRoles()
  if (roles?.some((e) => e === 'Admin')) networks.splice(0, 0, { id: '', title: 'All' })
  return { networks }
})
