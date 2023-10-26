import React, { Component } from 'react'
import { Box, Button, Container, Fade, Grid, LinearProgress, Stack, Typography, styled } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { ITopData } from '../../models'
import { AnalyticReduxProps } from './redux/type'
import AvancedMode, { AvancedModeContext } from '../AvancedMode'
import DateOption from '../../utils/DateOption'
import SelectMenu from '../../components/SelectMenu'
import SkeletonLazyWrap from '../../components/SkeletonLazyWrap'
import OverviewSection from './OverviewSection'
import TopData from './TopData'
import { LazyStatus } from '../../redux'

interface IProps extends AnalyticReduxProps {}
export default class Analytic extends Component<IProps> {
  getPeriod = () => {}

  getVideoDatas = () => {
    return this.props.AnalyticSlice.videos.map((e) => {
      const info = this.props.AnalyticSlice.videoInfos[e[0]]
      const t: ITopData = {
        id: e[0].toString(),
        title: info?.Snippet.Title ?? e[0].toString(),
        value: e[1] as number,
        imageUrl: info?.Snippet.Thumbnails?.Default__?.Url ?? 'example'
      }
      return t
    })
  }

  getChannelDatas = (): ITopData[] => {
    return this.props.AnalyticSlice.channels.map((e) => {
      const info = this.props.AnalyticSlice.channelInfos[e[0]]
      return {
        id: e[0].toString(),
        title: info?.Snippet.Title ?? e[0].toString(),
        value: e[1] as number,
        imageUrl: info?.Snippet.Thumbnails?.Default__?.Url ?? 'example'
      }
    })
  }

  componentDidMount(): void {
    this.props.fetchChartData()
  }

  render() {
    return (
      <AvancedMode>
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '24px' }}>
            {this.renderSelectDate()}
            <Box sx={{ flex: 1 }} />
            <Stack gap='6px'>
              {this.renderSelectNetwork()}
              <AvancedModeContext.Consumer>
                {({ open }) => (
                  <Button variant='contained' color='primary' onClick={open}>
                    Advanced Mode
                  </Button>
                )}
              </AvancedModeContext.Consumer>
            </Stack>
          </Box>
          <Box height='24px' />
          <OverviewSection AnalyticSlice={this.props.AnalyticSlice} />
          <Box height='64px' />
          {this.renderTopData()}
          <Box height='128px' />
        </Container>
      </AvancedMode>
    )
  }

  renderSelectNetwork = () => {
    const data = this.props.AnalyticSlice.networks[this.props.AnalyticSlice.networkIndex]
    return (
      <SelectMenu
        data={this.props.AnalyticSlice.networks}
        selectedIndex={this.props.AnalyticSlice.networkIndex}
        onSelected={this.props.setNetworkIndex}
        width={buttonWidth}
      >
        {(open) => (
          <CustomButton onClick={open} endIcon={<ArrowDropDownIcon />}>
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
    const data = DateOption.data[this.props.AnalyticSlice.dateIndex]
    const period = data?.value ? DateOption.toRangeDate(data?.value) : ''
    return (
      <SelectMenu
        data={DateOption.data}
        selectedIndex={this.props.AnalyticSlice.dateIndex}
        onSelected={this.props.setDateIndex}
        width={buttonWidth}
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

  renderTopData = () => {
    const data = DateOption.data[this.props.AnalyticSlice.dateIndex]
    const period = data?.value ? DateOption.toRangeDate(data?.value) : ''
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SkeletonLazyWrap status={this.props.AnalyticSlice.chartStatus}>
            <TopData
              baseUrl='https://youtu.be/'
              data={this.getVideoDatas()}
              config={{ title: 'Top Videos', date: period, measure: 'Views' }}
            />
          </SkeletonLazyWrap>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SkeletonLazyWrap status={this.props.AnalyticSlice.chartStatus}>
            <TopData
              baseUrl='https://www.youtube.com/channel/'
              data={this.getChannelDatas()}
              config={{ title: 'Top Channels', date: period, measure: 'Views' }}
            />
          </SkeletonLazyWrap>
        </Grid>
      </Grid>
    )
  }
}

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
