import React, { Component, PropsWithChildren } from 'react'
import { Box, Container, Fade, IconButton, Tooltip, styled } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IChartData } from '../core/type'
import {
  AvancedModeContext,
  IAvancedModeContext,
  IAvancedModeState,
  TAvancedModeOpen,
  TAvancedModeClose
} from './AvancedModeContext'
import DialogBase from './DialogBase'
import TabSection from './TabSection'
import DateMenu from '../components/DateMenu'
import FAKEDATA from '../core/FAKEDATA'
import { ChartData } from 'chart.js'
import { LineChart } from '../components/LineChart'
import TableTopData from './TableTopData'

export * from './AvancedModeContext'

type TProps = PropsWithChildren<{
  data: ChartData<'line', number[], string>
}>
export default class AvancedMode extends Component<TProps, IAvancedModeState> implements IAvancedModeContext {
  constructor(props: TProps) {
    super(props)
    this.state = { isOpen: false, selectedIndex: 0 }
  }

  get data(): IChartData {
    return FAKEDATA.lineChartAvancedMode
  }

  get dates(): string[] {
    return FAKEDATA.dates
  }

  open: TAvancedModeOpen = () => this.setState({ isOpen: true })

  close: TAvancedModeClose = (_, reason) => reason !== 'backdropClick' && this.setState({ isOpen: false })

  handleChange = (_: React.SyntheticEvent, value: number) => this.setState({ selectedIndex: value })

  render() {
    return (
      <AvancedModeContext.Provider value={this}>
        {this.props.children}
        <DialogBase open={this.state.isOpen} onClose={this.close}>
          {this.renderHeader()}
          <Box sx={{ borderBottom: borderValue }}>
            <Container maxWidth={false}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: sectionHeight }}>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ height: '100%', borderRight: borderValue }} />
                <DateMenu data={this.dates} hoverDisabled sx={{ borderRadius: 0 }} />
              </Box>
            </Container>
          </Box>
          <Box sx={{ borderBottom: borderValue }}>
            <Container maxWidth={false}>
              <TabSection data={this.data.details} selectedIndex={this.state.selectedIndex} onChange={this.handleChange} />
            </Container>
          </Box>
          {this.renderTabPanels()}
          <TableTopData />
          
        </DialogBase>
      </AvancedModeContext.Provider>
    )
  }

  renderHeader = () => (
    <Header>
      <Tooltip title='Close'>
        <CustomIconButtonClose onClick={this.close}>
          <CloseIcon />
        </CustomIconButtonClose>
      </Tooltip>
    </Header>
  )

  renderTabPanels = () => {
    return this.data.details.map((e, index) => {
      const isSelected = index === this.state.selectedIndex
      return (
        <Fade key={index} unmountOnExit in={isSelected} timeout={{ enter: 450, exit: 0 }}>
          <Container maxWidth={false} sx={{ pt: '28px', display: isSelected ? 'block' : 'none' }}>
            <Box sx={{ flex: 1, display: 'flex', padding: '0 5px', height: '400px' }}>
              <LineChart options={{ plugins: { legend: { display: false } } }} data={this.props.data} />
            </Box>
          </Container>
        </Fade>
      )
    })
  }
}

const sectionHeight = '56px'
const borderValue = '1px solid rgba(0,0,0,0.09)'

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
