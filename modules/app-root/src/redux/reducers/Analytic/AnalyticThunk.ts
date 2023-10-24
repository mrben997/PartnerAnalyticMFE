import { Graphql } from 'graphql-service-mfe'
import { Dictionary, createAsyncThunk } from '@reduxjs/toolkit'
import { IDataInfo, INetwork, ITopData, TQueryParams } from '../../../utils/type'
import DateOption from '../../../utils/DateOption'
import FakeDataLocal from '../../../utils/FakeDataLocal'
import store from '../..'
import AnalyticService from '../../../services/AnalyticService'

const getLineChartData = (dates: string[], signal?: AbortSignal) => {
  const params: TQueryParams = {
    fields: 'View, WatchTime, Money',
    includeTotal: true,
    sortBy: 'View desc',
    // take: 15,
    time: 'Day',
    affterDate: dates[0],
    beforeDate: dates[1]
  }
  return Graphql.Report.Query(Graphql.QReport.Query(params), { signal })
}

const getTopData = (dates: string[], kind: 'Video' | 'Channel', signal?: AbortSignal) => {
  const params: TQueryParams = {
    fields: 'View',
    kind,
    sortBy: 'View desc',
    affterDate: dates[0],
    beforeDate: dates[1],
    take: 10
  }
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
  const state = store.getState().AnalyticSlice
  const dateCurrent = DateOption.toStringRequest(DateOption.data[state.dateIndex].value.map((e) => new Date(e)))

  const [lineChart, resTopVideos, resTopChannels] = await Promise.all([
    getLineChartData(dateCurrent, context.signal),
    getTopData(dateCurrent, 'Video', context.signal),
    getTopData(dateCurrent, 'Channel', context.signal)
  ])
  console.log(lineChart)

  const [first, ...data] = (lineChart.query?.data ?? []) as (string | number)[][]
  if ((first?.length ?? 0) > 3) {
    first[2] = (first[2] as number) / 60
  }
  if ((data?.length ?? 0) > 0) {
    data.forEach((elm) => {
      elm[2] = (elm[2] as number) / 60
    })
  }
  const videoIds = (resTopVideos.query?.data ?? []).map((e) => e[0]) as string[]
  const channelIds = (resTopChannels.query?.data ?? []).map((e) => e[0]) as string[]

  const [videos, channels] = await Promise.all([
    AnalyticService.GetVideoInfo(videoIds, context.signal),
    AnalyticService.GetChannelInfo(channelIds, context.signal)
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
  networks: INetwork[]
}
export const fetchAnalyticConfigThunk = createAsyncThunk<IConfigReturn>('fetchAnalyticConfigThunk', async () => {
  return { networks: FakeDataLocal.networks }
})
