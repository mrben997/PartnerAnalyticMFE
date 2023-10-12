import { Component, SyntheticEvent } from 'react'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import { Box, Fade, Tab, Typography } from '@mui/material'
import { LineChart } from './LineChart'
import { IChartData } from '../core/type'
import { FormatterUSD, GenerateLineChartData, HumanNumber } from '../core/helper'

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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList centered onChange={this.handleChange} aria-label="lab API tabs example">
            {this.renderTabs()}
          </TabList>
        </Box>
        <Box sx={{ height: '400px' }}>{this.renderTabPanels()}</Box>
      </TabContext>
    )
  }

  renderTabs = () => {
    if (!this.props.data) return <></>
    return this.props.data.details.map((e, index) => (
      <Tab
        key={'key' + index}
        value={index + ''}
        label={
          <Box sx={{ minWidth: '300px', textTransform: 'none' }}>
            <Typography variant="subtitle1">{e.title}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {index === 2 ? FormatterUSD().format(e.total) : HumanNumber(e.total)}
            </Typography>
          </Box>
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
