import React, { Component } from 'react'
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { OverviewSection, TopData } from '../../components'
import AvancedMode, { AvancedModeContext } from '../AvancedMode'
import FakeDataLocal from '../../utils/FakeDataLocal'
import { AnalyticReduxProps, DateMenuRedux, LazyStatus, NetworkMenuRedux } from '../../redux'
import { IChartData, ITopData } from '../../utils/type'
import { ChartData } from 'chart.js'
import DateOption from '../../utils/DateOption'
import SkeletonLazyWrap from '../../components/SkeletonLazyView'

interface IProps extends AnalyticReduxProps {}
export default class Analytic extends Component<IProps> {
  componentDidMount(): void {
    this.props.fetchChartData()
  }
  render() {
    return (
      <Container maxWidth={false}>
        {this.renderTopBar()}
        <Box height='24px' />
        <OverviewSection AnalyticSlice={this.props.AnalyticSlice} />
        <Box height='64px' />
        {this.renderTopData()}
        <Box height='128px' />
      </Container>
    )
  }

  renderTopBar = () => {
    return (
      <AvancedMode data={FakeDataLocal.avancedMode}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '24px' }}>
          <DateMenuRedux />
          <Box sx={{ flex: 1 }} />
          <Stack gap='6px'>
            <NetworkMenuRedux />
            <AvancedModeContext.Consumer>
              {({ open }) => (
                <Button variant='contained' color='primary' onClick={open}>
                  Advanced Mode
                </Button>
              )}
            </AvancedModeContext.Consumer>
          </Stack>
        </Box>
      </AvancedMode>
    )
  }

  getVideoDatas = () => {
    return this.props.AnalyticSlice.videos.map((e) => {
      const info = this.props.AnalyticSlice.videoInfos[e[0]]
      const t: ITopData = {
        title: info?.Snippet.Title ?? e[0].toString(),
        value: e[1] as number,
        imageUrl: info?.Snippet.Thumbnails?.Default__?.Url ?? 'example'
      }
      return t
    })
  }

  getChannelDatas = () => {
    return this.props.AnalyticSlice.channels.map((e) => {
      const info = this.props.AnalyticSlice.channelInfos[e[0]]
      const t: ITopData = {
        title: info?.Snippet.Title ?? e[0].toString(),
        value: e[1] as number,
        imageUrl: info?.Snippet.Thumbnails?.Default__?.Url ?? 'example'
      }
      return t
    })
  }

  getTitle = () => DateOption.data[this.props.AnalyticSlice.dateIndex]?.title || 'Title'
  getPeriod = () => {
    const temp = DateOption.data[this.props.AnalyticSlice.dateIndex]?.value
    if (!temp) return ''
    return DateOption.toRangeDate(temp)
  }

  getIsLoading = () => this.props.AnalyticSlice.chartStatus !== LazyStatus.Loaded

  renderTopData = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SkeletonLazyWrap isLoading={this.getIsLoading()}>
            <TopData
              data={this.getVideoDatas()}
              config={{
                title: 'Top Videos',
                date: this.getPeriod(),
                measure: 'Views'
              }}
            />
          </SkeletonLazyWrap>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SkeletonLazyWrap isLoading={this.getIsLoading()}>
            <TopData
              data={this.getChannelDatas()}
              config={{
                title: 'Top Channels',
                date: this.getPeriod(),
                measure: 'Views'
              }}
            />
          </SkeletonLazyWrap>
        </Grid>
      </Grid>
    )
  }
}
