import React, { Component, SyntheticEvent } from 'react'
import { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { Box, Tab, Tabs, Typography, styled } from '@mui/material'
import { humanNumber, formatterUSD, formatNumber } from 'csmfe/helper'
import { a11yProps } from './helper'
import { hummanDate } from '../../../utils/helper'
import { IAnalyticSliceState } from '../redux/type'
import { LineChart } from '../../../components/LineChart'
import SkeletonLazyWrap from '../../../components/SkeletonLazyWrap'

const TABS = ['Views', 'Watch time (hours)', 'Estimated partner revenue']

interface IProps {
  loading?: boolean
  AnalyticSlice: IAnalyticSliceState
}
interface IState {
  tabIndex: number
}

export class OverviewSection extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { tabIndex: 0 }
  }

  get data() {
    return this.sortByDate(this.props.AnalyticSlice.data)
  }

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

  getData = () => this.data.map((e) => e[this.state.tabIndex + 1] as number)

  generateLineChart = (): ChartData<'line', number[], string> => ({
    labels: this.getLabels(),
    datasets: [
      {
        label: TABS[this.state.tabIndex],
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
  })

  customLabel(context: TooltipItem<'line'>) {
    const label = context.dataset.label
    let value = context.dataset.data[context.dataIndex] + ''
    if (this.state.tabIndex === 2) value = formatterUSD().format(parseFloat(value))
    else value = formatNumber.format(parseInt(value))
    return ` ${label}:ㅤ${value}` // eslint-disable-line
  }

  getOption = (): ChartOptions<'line'> => ({
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => this.customLabel(context) }, textDirection: 'ltr' }
    },
    scales: { y: { beginAtZero: true } }
  })

  handleChange = (_: SyntheticEvent, value: number) => this.setState({ tabIndex: value })

  render() {
    return (
      <>
        <CustomTabs centered value={this.state.tabIndex} onChange={this.handleChange}>
          {this.renderTabs()}
        </CustomTabs>
        <SkeletonLazyWrap status={this.props.AnalyticSlice.chartStatus}>
          <Box sx={{ minHeight: '300px', marginTop: '12px' }}>
            <LineChart key={this.state.tabIndex} options={this.getOption()} data={this.generateLineChart()} />
          </Box>
        </SkeletonLazyWrap>
      </>
    )
  }

  renderTabs = () => {
    const tabs = this.props.AnalyticSlice.totals.slice(1).map((e, i) => ({ title: TABS[i], total: e as number }))
    return tabs.map((e, index) => (
      <Tab
        key={index}
        value={index}
        sx={{ textTransform: 'none', flex: 1, maxWidth: 'unset' }}
        {...a11yProps('overview-tab', index)}
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
}

export default OverviewSection

const CustomTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: 1,
  borderColor: 'divider',
  px: '24px'
}))
