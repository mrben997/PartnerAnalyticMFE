import React, { Component } from 'react'
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { OverviewSection, TopData, DateMenu, NetworkMenu } from './components'
import AvancedMode, { AvancedModeContext } from './AvancedMode'
import FAKEDATA from './core/FAKEDATA'

export default class App extends Component {
  render() {
    return (
      <Container>
        <Box sx={{ px: '24px' }}>
          <AvancedMode data={FAKEDATA.avancedMode}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                marginTop: '24px'
              }}
            >
              <DateMenu data={FAKEDATA.dates} />
              <Box sx={{ flex: 1 }} />
              <Stack gap='6px'>
                <NetworkMenu data={FAKEDATA.networks} />
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
          <Box height='24px' />
          <OverviewSection data={FAKEDATA.lineChart} />
          <Box height='64px' />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TopData data={FAKEDATA.topData1} />
            </Grid>
            <Grid item xs={6}>
              <TopData data={FAKEDATA.topData2} />
            </Grid>
          </Grid>
          <Box height='128px' />
        </Box>
      </Container>
    )
  }
}
