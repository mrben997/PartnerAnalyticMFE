import React, { Component } from 'react'
import { faker } from '@faker-js/faker'
import { Container } from '@mui/material'
import TableContentExample, { ColumnHeader, ResponseQuerys, TabAvancedModelMetrics } from './components/TableContentExample'

export default class AppV2 extends Component {
  generateTableData = () => {
    const max = 20
    const ColumnHeaders: ColumnHeader[] = TabAvancedModelMetrics.map((e) => ({ Name: e.Name }))
    const Rows: Array<number>[] = []

    for (let index = 0; index < max; index++) {
      Rows.push([
        faker.number.int({ min: 0, max: 10000 }),
        faker.number.int({ min: 0, max: 10000 }),
        faker.number.int({ min: 0, max: 10000 }),
      ])
    }

    const data: ResponseQuerys = {
      Status: 'Data Test',
      Data: { ColumnHeaders, Rows },
    }

    return data
  }

  render() {
    return (
      <Container>
        <TableContentExample
          HasSelect={true}
          ChartKeys={[]}
          ChartType="Header"
          SetSelects={(keys: string[]) => {}}
          SetShowTotal={(show: boolean) => {}}
          MetaName={{}}
          data={this.generateTableData()}
        />
      </Container>
    )
  }
}
