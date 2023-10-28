import { Graphql } from 'graphql-service-mfe'
import { Dictionary, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from 'OIDC-auth/Components/ApiAuthorization/AuthorizeService'
import { AbortCancel, SetupCancel, calculateWatchTime } from '../../../redux/helper'
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

interface IReturnTable {
  tableData: IRowData[]
}
export const fetchAvancedModeThunk = createAsyncThunk<IReturnTable>('fetchAvancedModeThunk', async (_, context) => {
  AbortCancel('fetchLineChartThunk')
  SetupCancel('fetchAvancedModeThunk', context.abort)

  const state = store.getState().AvancedModeSlice
  const dates = DateOption.toStringRequest(DateOption.data[state.dateIndex].value.map((e) => new Date(e)))
  const networkId = state.networks[state.networkIndex].id
  const kind = KindOption.data[state.tabIndex].id
  const sortBy = MetricOption.getSortString(MetricOption.data[state.metricIndex].id)
  const searchId = state.searchId

  const tableDataRes = await getTableData({ dates, networkId, kind, sortBy, ids: searchId ? [searchId] : [] }, context.signal)
  const table = calculateWatchTime((tableDataRes.query?.data ?? []) as (string | number)[][], 2)

  return {
    tableData: table.map<IRowData>((e) => ({
      id: e[0].toString(),
      title: e[0].toString(),
      views: e[1] as number,
      estimatedMinutesWatched: e[2],
      estimatedRevenue: e[3] as number
    }))
  }
})
interface ILineChartReturn {
  lineChart: TLineChart
  dates: TRowDataProperty[]
  info: Dictionary<IDataInfo>
}
export const fetchLineChartThunk = createAsyncThunk<ILineChartReturn>('fetchLineChartThunk', async (_, context) => {
  SetupCancel('fetchLineChartThunk', context.abort)

  const state = store.getState().AvancedModeSlice
  const dates = DateOption.toStringRequest(DateOption.data[state.dateIndex].value.map((e) => new Date(e)))
  const networkId = state.networks[state.networkIndex].id
  const kind = KindOption.data[state.tabIndex].id
  const sortBy = MetricOption.getSortString(MetricOption.data[state.metricIndex].id)
  const ids = state.tableData.map((e) => e.id as string).slice(1)

  const [info, lineChart] = await Promise.all([
    getInfo(ids, kind, context.signal).catch(() => ({})),
    getLineChartData({ dates, networkId, kind, sortBy, ids }, context.signal)
  ])
  return {
    lineChart: LineChartProcessor.mapLineChart((lineChart.query?.data ?? []) as TRowDataProperty[][]),
    dates: LineChartProcessor.getDates((lineChart.query?.data ?? []) as TRowDataProperty[][]),
    info
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
