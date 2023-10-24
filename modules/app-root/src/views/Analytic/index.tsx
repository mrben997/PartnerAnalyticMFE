import React, { Component } from 'react'
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { OverviewSection, TopData } from '../../components'
import AvancedMode, { AvancedModeContext } from '../AvancedMode'
import FakeDataLocal from '../../utils/FakeDataLocal'
import { AnalyticReduxProps, DateMenuRedux, NetworkMenuRedux } from '../../redux'

interface IProps extends AnalyticReduxProps {}
export default class Analytic extends Component<IProps> {
  render() {
    return (
      <Container maxWidth={false}>
        {this.renderTopBar()}
        <Box height='24px' />
        <OverviewSection data={FakeDataLocal.lineChart} />
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

  renderTopData = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TopData data={FakeDataLocal.topData1} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TopData data={FakeDataLocal.topData2} />
        </Grid>
      </Grid>
    )
  }
}
