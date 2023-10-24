import React, { Component, SyntheticEvent } from 'react'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import { humanNumber, formatterUSD } from 'csmfe/helper'
import { Box, Fade, Tab, Typography, styled } from '@mui/material'
import { LineChart } from './LineChart'
import { IChartData } from '../utils/type'
import { GenerateLineChartData } from '../utils/helper'
import { IAnalyticStateRedux } from '../redux/reducers/analytic/AnalyticSlice'
import { ChartData } from 'chart.js'
import { LazyStatus } from '../redux'
import SkeletonLazyWrap from './SkeletonLazyView'

const tabs = ['Views', 'Watch time (hours)', 'Estimated partner revenue']

interface IProps {
  loading?: boolean
  AnalyticSlice: IAnalyticStateRedux
}
interface IState {
  tabIndex: string
}
export class OverviewSection extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { tabIndex: '0' }
  }

  get data() {
    // return this.props.AnalyticSlice.data
    return this.sortByDate(this.props.AnalyticSlice.data)
  }

  getTabs = () => this.props.AnalyticSlice.totals.slice(1).map((e, i) => ({ title: tabs[i], total: e as number }))

  sortByDate = (params: (string | number)[][]) => {
    const temp = params.slice()
    temp.sort((a, b) => {
      // const dateA = new Date(`${a[0].substring(0, 4)}-${a[0].substring(4, 6)}-${a[0].substring(6, 8)}`)
      // const dateB = new Date(`${b[0].substring(0, 4)}-${b[0].substring(4, 6)}-${b[0].substring(6, 8)}`)
      const aa = a[0].toString()
      const bb = b[0].toString()
      return aa > bb ? 1 : aa < bb ? -1 : 0
    })
    return temp
  }

  hummanDate = (value: string) => `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`

  getLabels = () => this.data.map((e) => e[0].toString())

  getData = () => this.data.map((e) => e[parseInt(this.state.tabIndex) + 1] as number)

  getIsLoading = () => this.props.AnalyticSlice.chartStatus !== LazyStatus.Loaded

  generateLineChart = (): ChartData<'line', number[], string> => {
    return {
      labels: this.getLabels(),
      datasets: [
        {
          label: tabs[this.state.tabIndex],
          data: this.getData(),
          fill: { target: 'origin', above: 'rgb(154 208 245 / 30%)' },
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgba(53, 162, 235)',
          borderWidth: 2,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: 'rgb(255, 99, 132)',
          pointHoverBorderColor: 'white'
        }
      ]
    }
  }

  handleChange = (_: SyntheticEvent, value: string) => this.setState({ tabIndex: value })

  render() {
    return (
      <TabContext value={this.state.tabIndex}>
        <TabList
          centered
          onChange={this.handleChange}
          sx={{ borderBottom: 1, borderColor: 'divider', px: '24px', minWidth: '600px' }}
        >
          {this.renderTabs()}
        </TabList>
        <Box sx={{ minHeight: '200px' }}>{this.renderTabPanels()}</Box>
      </TabContext>
    )
  }

  renderTabs = () => {
    return this.getTabs().map((e, index) => (
      <Tab
        key={index}
        value={index + ''}
        sx={{ textTransform: 'none', flex: 1, maxWidth: 'unset' }}
        label={
          <>
            <Typography variant='subtitle1' component='span' sx={{ display: 'block' }}>
              {e.title}
            </Typography>
            <SkeletonLazyWrap component='span' isLoading={this.getIsLoading()} sx={{ width: '100%' }}>
              <Typography variant='h6' component='span' sx={{ display: 'block', fontWeight: 'bold' }}>
                {index === 2 ? formatterUSD().format(e.total) : humanNumber(e.total)}
              </Typography>
            </SkeletonLazyWrap>
          </>
        }
      />
    ))
  }

  renderTabPanels = () => {
    const data = this.generateLineChart()
    return (
      <SkeletonLazyWrap isLoading={this.getIsLoading()}>
        <Box sx={{ minHeight: '300px', marginTop: '12px' }}>
          <LineChart key={this.state.tabIndex} options={{ plugins: { legend: { display: false } } }} data={data} />
        </Box>
      </SkeletonLazyWrap>
    )
  }
}

export default OverviewSection
