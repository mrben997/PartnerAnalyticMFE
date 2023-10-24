import React, { Component, SyntheticEvent } from 'react'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import { humanNumber, formatterUSD } from 'csmfe/helper'
import { Box, Fade, Tab, Typography, styled } from '@mui/material'
import { LineChart } from './LineChart'
import { IChartData } from '../utils/type'
import { GenerateLineChartData } from '../utils/helper'

interface IProps {
  data?: IChartData
  loading?: boolean
}
interface IState {
  tabIndex: string
}
export class OverviewSection extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { tabIndex: '0' }
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
        <Box sx={{ height: '400px' }}>{this.renderTabPanels()}</Box>
      </TabContext>
    )
  }

  renderTabs = () => {
    if (!this.props.data) return <></>
    return this.props.data.details.map((e, index) => (
      <Tab
        key={index}
        value={index + ''}
        sx={{ textTransform: 'none', flex: 1, maxWidth: 'unset' }}
        label={
          <>
            <Typography variant='subtitle1'>{e.title}</Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              {index === 2 ? formatterUSD().format(e.total) : humanNumber(e.total)}
            </Typography>
          </>
        }
      />
    ))
  }

  renderTabPanels = () => {
    if (!this.props.data) return <></>
    const data = GenerateLineChartData(this.props.data, parseInt(this.state.tabIndex))
    return this.props.data.details.map((e, index) => (
      <Fade key={'key' + index} in={index + '' === this.state.tabIndex} unmountOnExit timeout={{ exit: 0, enter: 350 }}>
        <TabPanel sx={{ height: '100%', padding: '24px 0' }} value={index + ''}>
          <LineChart options={{ plugins: { legend: { display: false } } }} data={data} />
        </TabPanel>
      </Fade>
    ))
  }
}

export default OverviewSection
