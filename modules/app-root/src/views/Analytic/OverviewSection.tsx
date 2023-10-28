import React, { Component, SyntheticEvent } from 'react'
import { ChartData } from 'chart.js'
import { TabList, TabContext } from '@mui/lab'
import { Box, Tab, Typography, styled } from '@mui/material'
import { humanNumber, formatterUSD } from 'csmfe/helper'
import { LineChart } from '../../components/LineChart'
import { IAnalyticStateRedux } from './redux/AnalyticSlice'
import SkeletonLazyWrap from '../../components/SkeletonLazyWrap'
import { hummanDate } from '../../utils/helper'

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
    return this.sortByDate(this.props.AnalyticSlice.data)
  }

  getTabs = () => this.props.AnalyticSlice.totals.slice(1).map((e, i) => ({ title: tabs[i], total: e as number }))

  sortByDate = (params: (string | number)[][]) => {
    const temp = params.slice()
    temp.sort((a, b) => {
      const aa = a[0].toString()
      const bb = b[0].toString()
      return aa > bb ? 1 : aa < bb ? -1 : 0
    })
    return temp
  }

  getLabels = () => this.data.map((e) => hummanDate(e[0].toString()))

  getData = () => this.data.map((e) => e[parseInt(this.state.tabIndex) + 1] as number)

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
        <CustomTabList centered onChange={this.handleChange}>
          {this.renderTabs()}
        </CustomTabList>
        {this.renderTabPanels()}
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
            <Typography variant='subtitle1' component='span' sx={{ display: 'block', width: '100%' }} noWrap>
              {e.title}
            </Typography>
            <SkeletonLazyWrap component='span' status={this.props.AnalyticSlice.chartStatus} sx={{ width: '100%' }}>
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
      <SkeletonLazyWrap status={this.props.AnalyticSlice.chartStatus}>
        <Box sx={{ minHeight: '300px', marginTop: '12px' }}>
          <LineChart key={this.state.tabIndex} options={{ plugins: { legend: { display: false } } }} data={data} />
        </Box>
      </SkeletonLazyWrap>
    )
  }
}

export default OverviewSection

const CustomTabList = styled(TabList)(({ theme }) => ({
  borderBottom: 1,
  borderColor: 'divider',
  px: '24px'
}))
