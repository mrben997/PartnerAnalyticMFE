import React, { Component } from 'react'
import { Box, Button, Container, IconButton, TextField, Tooltip, Typography, styled } from '@mui/material'
import PollIcon from '@mui/icons-material/Poll'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { LineChart } from '../../components/LineChart'
import { AvancedModeContext } from './AvancedModeContext'
import TabSection from './TabSection'
import AvancedModeTable from '../AvancedModeTable'
import FakeDataLocal from '../../utils/FakeDataLocal'
import { AvancedModeReduxProps } from '../../redux'
import SelectMenu from '../../components/SelectMenu'
import DateOption from '../../utils/DateOption'
import MetricOption from '../../utils/MetricOption'
import KindOption from '../../utils/KindOption'
import SelectedProcessor from '../../utils/SelectedProcessor'
import SkeletonLazyWrap from '../../components/SkeletonLazyWrap'

interface IProps extends AvancedModeReduxProps {}

export default class AvancedModeBase extends Component<IProps> {
  componentDidMount(): void {
    this.props.fetchChartData()
  }

  getSelectAccessor = (): SelectedProcessor => {
    const metricType = MetricOption.data[this.props.AvancedModeSlice.metricIndex].id
    return new SelectedProcessor(this.props.AvancedModeSlice.tableData, metricType)
  }

  render() {
    return (
      <>
        {this.renderHeader()}
        <Box sx={{ borderBottom: borderValue }}>
          <Container maxWidth={false}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: sectionHeight }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CirBox>
                  <PollIcon fontSize='large' sx={{ color: '#fff' }} />
                </CirBox>
                <TextField placeholder='Search channelId' size='small' name='search' />
              </Box>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ height: '100%', borderRight: borderValue }} />
              {this.renderSelectDate()}
              <Box sx={{ height: '100%', borderRight: borderValue }} />
              {this.renderSelectNetwork()}
            </Box>
          </Container>
        </Box>
        <Box sx={{ borderBottom: borderValue }}>
          <Container maxWidth={false}>
            <TabSection
              data={KindOption.data.map((e) => e.title)}
              selectedIndex={this.props.AvancedModeSlice.tabIndex}
              onChange={(_, value: number) => this.props.setTabIndex(value)}
            />
          </Container>
        </Box>
        <Container maxWidth={false} sx={{ pt: '12px' }}>
          {this.renderSelectMetric()}
          <Box sx={{ flex: 1, display: 'flex', padding: '0 5px', height: '400px' }}>
            <LineChart options={{ plugins: { legend: { display: false } } }} data={FakeDataLocal.avancedMode} />
          </Box>
        </Container>
        <SkeletonLazyWrap status={this.props.AvancedModeSlice.fetchStatus}>
          <AvancedModeTable selectedProcessor={this.getSelectAccessor()} metricIndex={this.props.AvancedModeSlice.metricIndex} />
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

const Header = styled(Box)({
  height: sectionHeight,
  borderBottom: borderValue,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '8px 24px',
  background: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 100
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
