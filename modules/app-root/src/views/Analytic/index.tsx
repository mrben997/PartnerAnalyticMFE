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
import { getThumbnailYoutube } from '../../utils/helper'
import { LazyStatus } from '../../redux'

interface IProps extends AnalyticReduxProps {}
export default class Analytic extends Component<IProps> {
  getVideoDatas = () => {
    return this.props.AnalyticSlice.videos.map((e) => {
      const info = this.props.AnalyticSlice.videoInfos[e[0]]
      const t: ITopData = {
        id: e[0].toString(),
        title: info?.Snippet.Title ?? e[0].toString(),
        value: e[1] as number,
        imageUrl: getThumbnailYoutube(e[0] + '', info?.Snippet.Thumbnails?.Default__?.Url)
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
        <CustomContainer maxWidth={false}>
          <StickyBox sx={{}}>
            <Fade in={this.props.AnalyticSlice.chartStatus === LazyStatus.Loading}>
              <LinearProgress sx={{ mx: '-24px' }} />
            </Fade>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '24px' }}>
              {this.renderSelectDate()}
              {this.renderSelectNetwork()}
              <Box sx={{ flex: 1 }} />
              <AvancedModeContext.Consumer>
                {({ open }) => (
                  <Button variant='contained' color='primary' size='small' onClick={open}>
                    <Typography component='span' noWrap>
                      Advanced Mode
                    </Typography>
                  </Button>
                )}
              </AvancedModeContext.Consumer>
            </Box>
          </StickyBox>
          <OverviewSection AnalyticSlice={this.props.AnalyticSlice} />
          <Box height='64px' />
          {this.renderTopData()}
          <Box height='128px' />
        </CustomContainer>
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
        widthPC={buttonWidth}
        widthMobile={buttonWidthMobile}
      >
        {(open) => (
          <CustomButton onClick={open} endIcon={<ArrowDropDownIcon />}>
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
    const data = DateOption.data[this.props.AnalyticSlice.dateIndex]
    const period = data?.value ? DateOption.toRangeDate(data?.value) : ''
    return (
      <SelectMenu
        data={DateOption.data}
        selectedIndex={this.props.AnalyticSlice.dateIndex}
        onSelected={this.props.setDateIndex}
        widthPC={buttonWidth}
        widthMobile={buttonWidthMobile}
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
const buttonWidthMobile = '175px'

const CustomContainer = styled(Container)({
  flex: 1,
  width: 'auto',
  minWidth: '650px'
})

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
  backgroundColor: '#fff',
  zIndex: 200,
  top: 0,
  paddingBottom: '8px',
  marginBottom: '16px'
})
