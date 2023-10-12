import React, { Component } from 'react'
import CreateTable from './CreateTable'
import { Box, Container, Typography } from '@mui/material'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import FAKEDATA from '../core/FAKEDATA'
import { ITableData } from '../core/type'
import { IFetchModel } from '../components/TableTemplate/type'

interface IProps {}
export default class TableTopData extends Component {
  Table
  constructor(props: IProps) {
    super(props)
    this.Table = CreateTable()
  }

  getData = () => {
    let arr = FAKEDATA.tableTopData
    return { data: arr, page: 0, pageSize: 25, rowTotal: arr.length }
  }

  handleFilterData = async (model: Partial<IFetchModel>) => {
    // const pagination = Object.assign({}, paginationDefault, model.PaginationModel)
    // const filter = TableConverter.graphql<ITrackDTO>(model, { pagination, searchOptions })
    // const request = { filter, page: pagination.page ?? 0 }
    // store.dispatch(fetchTrackThunk(request))
  }

  render() {
    const { Table } = this
    return (
      <Container maxWidth={false}>
        <Table
          PageInfo={this.getData()}
          ServerOption={{ FetchInitialData: async () => {}, FetchFilterData: this.handleFilterData }}
          sxWrapper={{ borderRadius: 0, border: 'unset' }}
          InnerProps={{ checkboxSelection: true }}
        />
      </Container>
    )
  }
}
