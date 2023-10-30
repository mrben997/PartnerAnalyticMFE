import { Graphql } from 'graphql-service-mfe'
import { Dictionary, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from 'OIDC-auth/Components/ApiAuthorization/AuthorizeService'
import { IAnalyticSliceState } from './type'
import { ISelectMenu } from '../../../components/type'
import { IDataInfo, TQueryParams } from '../../../models'
import { SetupCancel, calculateWatchTime } from '../../../redux/helper'
import DateOption from '../../../utils/DateOption'
import AnalyticService from '../../../services/AnalyticService'
import MediaNetworkService from '../../../services/ComponentService'

const getLineChartData = (dates: string[], networkId: string, signal?: AbortSignal) => {
  let params: TQueryParams = {
    fields: 'View, WatchTime, Money',
    includeTotal: 'None',
    sortBy: 'View desc',
    time: 'Day',
    affterDate: dates[0],
    beforeDate: dates[1]
  }
  if (networkId) params = Object.assign({}, params, { networkId })
  return Graphql.Report.Query(Graphql.QReport.Query(params), { signal })
}

const getTopData = (dates: string[], networkId: string, kind: 'Video' | 'Channel', signal?: AbortSignal) => {
  let params: TQueryParams = {
    fields: 'View',
    kind,
    sortBy: 'View desc',
    affterDate: dates[0],
    beforeDate: dates[1],
    take: 10
  }
  if (networkId) params = Object.assign({}, params, { networkId })
  return Graphql.Report.Query(Graphql.QReport.Query(params), { signal })
}

interface IReturn {
  totals: (string | number)[]
  data: (string | number)[][]
  videos: (string | number)[][]
  channels: (string | number)[][]
  videoInfos: Dictionary<IDataInfo>
  channelInfos: Dictionary<IDataInfo>
}
export const fetchAnalyticThunk = createAsyncThunk<IReturn>('fetchAnalyticThunk', async (_, context) => {
  SetupCancel('fetchAnalyticThunk', context.abort)

  const state = context.getState() as { AnalyticSlice: IAnalyticSliceState }
  const AnalyticSliceState = state.AnalyticSlice
  const dateCurrent = DateOption.toStringRequest(DateOption.data[AnalyticSliceState.dateIndex].value.map((e) => new Date(e)))
  const networkId = AnalyticSliceState.networks[AnalyticSliceState.networkIndex].id

  const [lineChart, resTopVideos, resTopChannels] = await Promise.all([
    getLineChartData(dateCurrent, networkId, context.signal),
    getTopData(dateCurrent, networkId, 'Video', context.signal),
    getTopData(dateCurrent, networkId, 'Channel', context.signal)
  ])

  const [first, ...data] = calculateWatchTime((lineChart.query?.data ?? []) as (string | number)[][], 2)

  const videoIds = (resTopVideos.query?.data ?? []).map((e) => e[0]) as string[]
  const channelIds = (resTopChannels.query?.data ?? []).map((e) => e[0]) as string[]

  const [videos, channels] = await Promise.all([
    AnalyticService.GetVideoInfo(videoIds, context.signal).catch(() => ({})),
    AnalyticService.GetChannelInfo(channelIds, context.signal).catch(() => ({}))
  ])

  return {
    totals: first ?? [],
    data,
    videos: (resTopVideos.query?.data ?? []) as (string | number)[][],
    channels: (resTopChannels.query?.data ?? []) as (string | number)[][],
    videoInfos: videos,
    channelInfos: channels
  }
})

interface IConfigReturn {
  networks: ISelectMenu[]
}
export const fetchAnalyticConfigThunk = createAsyncThunk<IConfigReturn>('fetchAnalyticConfigThunk', async (_, context) => {
  const networkRes = await MediaNetworkService.AllMediaNetwork(context.signal)
  const networks = networkRes.map<ISelectMenu>((e) => ({ id: e.Id, title: e.Name }))
  const roles = await authService.getRoles()
  if (roles?.some((e) => e === 'Admin')) networks.splice(0, 0, { id: '', title: 'All' })
  return { networks }
})
