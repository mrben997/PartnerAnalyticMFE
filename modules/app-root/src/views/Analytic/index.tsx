import React, { Component } from 'react'
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { AnalyticReduxProps } from '../../redux/type'
import { OverviewSection, TopData, DateMenu } from '../../components'
import AvancedMode, { AvancedModeContext } from '../AvancedMode'
import FAKEDATA from '../../utils/FAKEDATA'
import NetworkMenu from '../NetworkMenu'
import NetworkMenuRedux from '../../redux/maps/NetworkMenuRedux'

interface IProps extends AnalyticReduxProps {}
export default class Analytic extends Component<IProps> {
  render() {
    return (
      <Container maxWidth='xl'>
        <Box sx={{ px: '24px' }}>
          {this.renderTopBar()}
          <Box height='24px' />
          <OverviewSection data={FAKEDATA.lineChart} />
          <Box height='64px' />
          {this.renderTopData()}
          <Box height='128px' />
        </Box>
      </Container>
    )
  }

  renderTopBar = () => {
    return (
      <AvancedMode data={FAKEDATA.avancedMode}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '24px' }}>
          <DateMenu data={FAKEDATA.dates} />
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

  renderTopData = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TopData data={FAKEDATA.topData1} />
        </Grid>
        <Grid item xs={6}>
          <TopData data={FAKEDATA.topData2} />
        </Grid>
      </Grid>
    )
  }
}
