import { createAsyncThunk } from '@reduxjs/toolkit'
import { INetwork, TQueryParams } from '../../../utils/type'
import FakeDataLocal from '../../../utils/FakeDataLocal'
import { Graphql } from 'graphql-service-mfe'

interface IReturn {
  networks: INetwork[]
}
// Graphql

export const fetchAnalyticThunk = createAsyncThunk<IReturn>('fetchAnalyticThunk', async (args, context) => {
  const params: TQueryParams = {
    fields: 'View',
    includeTotal: true,
    sortBy: 'View desc',
    kind: 'Channel',
    take: 15
  }
  const res = await Graphql.Report.Query(Graphql.QReport.Query(params))
  console.log(res)

  return {
    networks: FakeDataLocal.networks
  }
})
