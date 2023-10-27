import React, { ChangeEventHandler, Component } from 'react'
import { Box, Button, Container, Fade, IconButton, LinearProgress, TextField, Tooltip, Typography, styled } from '@mui/material'
import PollIcon from '@mui/icons-material/Poll'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { LineChart } from '../../components/LineChart'
import { AvancedModeContext } from './AvancedModeContext'
import TabSection from './TabSection'
import AvancedModeTable from './AvancedModeTable'
import FakeDataLocal from '../../utils/FakeDataLocal'
import SelectMenu from '../../components/SelectMenu'
import DateOption from '../../utils/DateOption'
import MetricOption from '../../utils/MetricOption'
import KindOption from '../../utils/KindOption'
import SkeletonLazyWrap from '../../components/SkeletonLazyWrap'
import { ChartData } from 'chart.js'
import { AvancedModeReduxProps } from './redux/type'
import { cutStringToWidth, hummanDate } from '../../utils/helper'
import SelectedProcessor from '../../utils/SelectedProcessor'
import { LazyStatus } from '../../redux'

interface IDataResult {
  label?: string
  data: number[]
  color?: string
}

interface IProps extends AvancedModeReduxProps {}

export default class AvancedModeBase extends Component<IProps> {
  componentDidMount(): void {
    this.props.fetchChartData()
  }

  sortByDates = (params: (string | number)[][], index: number) => {
    const temp = params.slice()
    temp.sort((a, b) => {
      const aa = a[index].toString()
      const bb = b[index].toString()
      return aa > bb ? 1 : aa < bb ? -1 : 0
    })
    return temp
  }

  getLabels = () => this.props.AvancedModeSlice.dates.map((e) => hummanDate(e.toString()))

  getDatas = (): IDataResult[] => {
    const dates = this.props.AvancedModeSlice.dates
    const lineChart = this.props.AvancedModeSlice.lineChart
    const metric = MetricOption.getMetricString(this.props.AvancedModeSlice.metricIndex)

    let maping = this.props.AvancedModeSlice.tableDataMaping
    let ids = SelectedProcessor.getIdActives(maping, true)
    if (ids.length < 1) {
      maping = this.props.AvancedModeSlice.tableDataMapingDefault
      ids = Object.keys(maping) as string[]
    }

    return ids.map<IDataResult>((id) => {
      const item = maping[id]
      const data = dates.map<number>((date) => {
        const lc = lineChart[id]
        return ((lc && lc[date]?.[metric]) as number) ?? 0
      })
      const label = (this.props.AvancedModeSlice.info[item?.row.id ?? '']?.Snippet.Title ?? item?.row.id) as string
      return { color: item?.color, label, data }
    })
  }

  generateLineChartData = (): ChartData<'line', number[], string> => {
    const datasets = this.getDatas().map((item) => ({
      label: cutStringToWidth(item.label ?? 'None', 200),
      data: item.data,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: item.color,
      borderWidth: 2,
      pointBorderColor: item.color,
      pointBackgroundColor: item.color,
      pointHoverBackgroundColor: 'rgb(255, 99, 132)',
      pointHoverBorderColor: 'white',
      pointRadius: () => 0
    }))
    return { labels: this.getLabels(), datasets }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  timer: any
  /* eslint-enable */
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.setSearchId(e.target.value)
    }, 300)
  }

  getPlaceholderSearchId = (): string => {
    return this.props.AvancedModeSlice.tabIndex === 0 ? 'Search channelId' : 'Search videoId'
  }

  getLoadingStatus = () => {
    return (
      this.props.AvancedModeSlice.tableStatus === LazyStatus.Loading ||
      this.props.AvancedModeSlice.lineChartStatus === LazyStatus.Loading
    )
  }

  getBaseUrl = (): string => {
    return this.props.AvancedModeSlice.tabIndex === 0 ? 'https://www.youtube.com/channel/' : 'https://youtu.be/'
  }

  render() {
    return (
      <>
        <StickyBox>
          {this.renderHeader()}
          <Box sx={{ borderBottom: borderValue }}>
            <Container maxWidth={false}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: sectionHeight }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <CirBox>
                    <PollIcon fontSize='large' sx={{ color: '#fff' }} />
                  </CirBox>
                  <TextField
                    placeholder={this.getPlaceholderSearchId()}
                    size='small'
                    name='search'
                    onChange={this.handleChange}
                  />
                </Box>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ height: '100%', borderRight: borderValue }} />
                {this.renderSelectDate()}
                <Box sx={{ height: '100%', borderRight: borderValue }} />
                {this.renderSelectNetwork()}
              </Box>
            </Container>
          </Box>
          <Fade in={this.getLoadingStatus()}>
            <LinearProgress />
          </Fade>
          <Box sx={{ borderBottom: borderValue }}>
            <Container maxWidth={false}>
              <TabSection
                data={KindOption.data.map((e) => e.title)}
                selectedIndex={this.props.AvancedModeSlice.tabIndex}
                onChange={(_, value: number) => this.props.setTabIndex(value)}
              />
            </Container>
          </Box>
        </StickyBox>

        <SkeletonLazyWrap status={this.props.AvancedModeSlice.lineChartStatus} sxSkeleton={{ opacity: '0.35' }}>
          <Container maxWidth={false} sx={{ pt: '12px' }}>
            {this.renderSelectMetric()}
            <Box sx={{ flex: 1, display: 'flex', padding: '0 5px', height: '400px' }}>
              <LineChart options={{ plugins: { legend: { display: false } } }} data={this.generateLineChartData()} />
            </Box>
          </Container>
        </SkeletonLazyWrap>
        <SkeletonLazyWrap status={this.props.AvancedModeSlice.tableStatus} sxSkeleton={{ opacity: '0.35' }}>
          <AvancedModeTable
            info={this.props.AvancedModeSlice.info}
            tableData={this.props.AvancedModeSlice.tableData}
            tableDataMaping={this.props.AvancedModeSlice.tableDataMaping}
            tableDataMapingDefault={this.props.AvancedModeSlice.tableDataMapingDefault}
            metricIndex={this.props.AvancedModeSlice.metricIndex}
            baseUrl={this.getBaseUrl()}
            onChangeCheckbox={this.props.onSelectedTableCheckbox}
          />
        </SkeletonLazyWrap>
      </>
    )
  }

  renderHeader = () => (
    <AvancedModeContext.Consumer>
      {(context) => (
        <Header>
          <Tooltip title='Close'>
            <CustomIconButtonClose onClick={context.close}>
              <CloseIcon />
            </CustomIconButtonClose>
          </Tooltip>
        </Header>
      )}
    </AvancedModeContext.Consumer>
  )

  renderSelectNetwork = () => {
    const data = this.props.AvancedModeSlice.networks[this.props.AvancedModeSlice.networkIndex]
    return (
      <SelectMenu
        width={buttonWidth}
        onSelected={this.props.setNetworkIndex}
        data={this.props.AvancedModeSlice.networks}
        selectedIndex={this.props.AvancedModeSlice.networkIndex}
      >
        {(open) => (
          <CustomButton onClick={open} endIcon={<ArrowDropDownIcon />} sx={{ height: '100%' }}>
            <Box component='span' className='content-btn'>
              <Typography variant='subtitle2' component='span'>
                Network
              </Typography>
              <Typography variant='body1' component='span' sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {data?.title || 'Title'}
              </Typography>
            </Box>
          </CustomButton>
        )}
      </SelectMenu>
    )
  }

  renderSelectDate = () => {
    const data = DateOption.data[this.props.AvancedModeSlice.dateIndex]
    const period = data?.value ? DateOption.toRangeDate(data?.value) : ''
    return (
      <SelectMenu
        width={buttonWidth}
        data={DateOption.data}
        onSelected={this.props.setDateIndex}
        selectedIndex={this.props.AvancedModeSlice.dateIndex}
      >
        {(open) => (
          <CustomButton onClick={open} endIcon={<ArrowDropDownIcon />}>
            <Box component='span' className='content-btn'>
              <Typography variant='subtitle2' component='span'>
                {period}
              </Typography>
              <Typography variant='body1' component='span' sx={{ fontWeight: 600 }}>
                {data?.title || 'Title'}
              </Typography>
            </Box>
          </CustomButton>
        )}
      </SelectMenu>
    )
  }

  renderSelectMetric = () => {
    const data = MetricOption.data[this.props.AvancedModeSlice.metricIndex]
    const width = '250px'
    return (
      <SelectMenu
        width={width}
        data={MetricOption.data}
        onSelected={this.props.setMetricIndex}
        selectedIndex={this.props.AvancedModeSlice.metricIndex}
      >
        {(open) => (
          <CustomButton
            onClick={open}
            endIcon={<ArrowDropDownIcon />}
            sx={{ width, mb: '12px', ml: '42px', backgroundColor: 'rgba(0,0,0,0.05)' }}
          >
            <Box component='span' className='content-btn'>
              <Typography variant='body1' component='span' sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {data?.title || 'Title'}
              </Typography>
            </Box>
          </CustomButton>
        )}
      </SelectMenu>
    )
  }
}

const sectionHeight = '56px'
const borderValue = '1px solid rgba(0,0,0,0.09)'

const buttonWidth = '200px'
const CustomButton = styled(Button)({
  color: '#3c3c3c',
  width: buttonWidth,
  textTransform: 'unset',
  '& .content-btn': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
})

const StickyBox = styled(Box)({
  position: 'sticky',
  top: 0,
  zIndex: 200,
  background: '#fff'
})

const Header = styled(Box)({
  height: sectionHeight,
  borderBottom: borderValue,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '8px 24px'
})

const CustomIconButtonClose = styled(IconButton)({
  '& svg': { transition: 'all 0.3s' },
  '&:hover svg': { color: '#ff200c' }
})

const CirBox = styled(Box)({
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  background: '#f16022',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})
