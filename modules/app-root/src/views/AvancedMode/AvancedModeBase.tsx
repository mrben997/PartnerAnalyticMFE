import React, { ChangeEventHandler, Component } from 'react'
import { Box, Button, Container, Fade, IconButton, LinearProgress, TextField, Tooltip, Typography, styled } from '@mui/material'
import PollIcon from '@mui/icons-material/Poll'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { LazyStatus } from '../../redux'
import { AvancedModeReduxProps } from './redux/type'
import { AvancedModeContext } from './AvancedModeContext'
import TabSection from './subs/TabSection'
import TableSection from './subs/TableSection'
import DateOption from '../../utils/DateOption'
import KindOption from '../../utils/KindOption'
import MetricOption from '../../utils/MetricOption'
import SelectMenu from '../../components/SelectMenu'
import MultiaxiLineChart from './subs/MultiaxiLineChart'
import SkeletonLazyWrap from '../../components/SkeletonLazyWrap'

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
      <Wrapper>
        <StickyBox>
          {this.renderHeader()}
          <Container maxWidth={false} sx={{ borderBottom: borderValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: sectionHeight }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CirBox>
                  <PollIcon fontSize='large' sx={{ color: '#fff' }} />
                </CirBox>
                <TextField placeholder={this.getPlaceholderSearchId()} size='small' name='search' onChange={this.handleChange} />
              </Box>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ height: '100%', borderRight: borderValue }} />
              {this.renderSelectDate()}
              <Box sx={{ height: '100%', borderRight: borderValue }} />
              {this.renderSelectNetwork()}
            </Box>
          </Container>
          <Fade in={this.getLoadingStatus()}>
            <LinearProgress />
          </Fade>
          <Container maxWidth={false} sx={{ borderBottom: borderValue }}>
            <TabSection
              data={KindOption.data.map((e) => e.title)}
              selectedIndex={this.props.AvancedModeSlice.tabIndex}
              onChange={(_, value: number) => this.props.setTabIndex(value)}
            />
          </Container>
        </StickyBox>

        <SkeletonLazyWrap status={this.props.AvancedModeSlice.lineChartStatus} sxSkeleton={{ opacity: '0.35' }}>
          <Container maxWidth={false} sx={{ pt: '12px' }}>
            {this.renderSelectMetric()}
            <Box sx={{ flex: 1, display: 'flex', padding: '0 5px', height: '400px' }}>
              <MultiaxiLineChart
                dates={this.props.AvancedModeSlice.dates}
                info={this.props.AvancedModeSlice.info}
                lineChart={this.props.AvancedModeSlice.lineChart}
                metricIndex={this.props.AvancedModeSlice.metricIndex}
                tableDataMaping={this.props.AvancedModeSlice.tableDataMaping}
                tableDataMapingDefault={this.props.AvancedModeSlice.tableDataMapingDefault}
              />
            </Box>
          </Container>
        </SkeletonLazyWrap>
        <SkeletonLazyWrap status={this.props.AvancedModeSlice.tableStatus} sxSkeleton={{ opacity: '0.35' }}>
          <TableSection
            info={this.props.AvancedModeSlice.info}
            tableData={this.props.AvancedModeSlice.tableData}
            tableDataMaping={this.props.AvancedModeSlice.tableDataMaping}
            tableDataMapingDefault={this.props.AvancedModeSlice.tableDataMapingDefault}
            metricIndex={this.props.AvancedModeSlice.metricIndex}
            baseUrl={this.getBaseUrl()}
            onChangeCheckbox={this.props.onSelectedTableCheckbox}
          />
        </SkeletonLazyWrap>
      </Wrapper>
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
        widthPC={buttonWidth}
        widthMobile={buttonWidthMobile}
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
        widthPC={buttonWidth}
        widthMobile={buttonWidthMobile}
        data={DateOption.data}
        onSelected={this.props.setDateIndex}
        selectedIndex={this.props.AvancedModeSlice.dateIndex}
      >
        {(open) => (
          <CustomButton onClick={open} endIcon={<ArrowDropDownIcon />}>
            <Box component='span' className='content-btn'>
              <Typography variant='subtitle2' component='span' noWrap sx={{ width: '100%', display: 'block' }}>
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
        widthPC={width}
        widthMobile={buttonWidthMobile}
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
const buttonWidthMobile = '175px'

const Wrapper = styled(Box)(({ theme }) => ({
  minWidth: '650px'
}))

const CustomButton = styled(Button)(({ theme }) => ({
  color: '#3c3c3c',
  width: buttonWidth,
  textTransform: 'unset',
  textAlign: 'left',
  '& .content-btn': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  [theme.breakpoints.down('md')]: { width: buttonWidthMobile }
}))

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
