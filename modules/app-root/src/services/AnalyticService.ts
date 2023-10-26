import { CreateHttpService, ServiceBase } from 'graphql-service-mfe'
import { IDataInfo } from '../models'
import { Dictionary } from '@reduxjs/toolkit'

class AnalyticServiceBase extends ServiceBase {
  constructor() {
    super(CreateHttpService(`${window.location.origin}/api/user/v2/YoutubeReport`))
  }

  _UrlVideoInfo = 'GetVideoInfos'
  GetVideoInfo = async (data: string[], signal?: AbortSignal) => {
    const InfoData = await this.Post<IDataInfo[]>(this._UrlVideoInfo, data, {
      signal,
      headers: { 'Content-Type': 'application/json' }
    })

    return InfoData.reduce<Dictionary<IDataInfo>>((a, b) => {
      a[b.Id] = b
      return a
    }, {})
  }

  _UrlChannelInfo = 'GetChannelInfos'
  GetChannelInfo = async (data: string[], signal?: AbortSignal) => {
    const InfoData = await this.Post<IDataInfo[]>(this._UrlChannelInfo, data, {
      signal,
      headers: { 'Content-Type': 'application/json' }
    })

    return InfoData.reduce<Dictionary<IDataInfo>>((a, b) => {
      a[b.Id] = b
      return a
    }, {})
  }
}

const AnalyticService = new AnalyticServiceBase()
export default AnalyticService
