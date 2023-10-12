import { Component, SyntheticEvent } from 'react'
import { SxProps, Tab, Tabs, Theme, styled } from '@mui/material'
import { IChartDetail } from '../core/type'

interface IProps {
  selectedIndex: number
  onChange?: (event: SyntheticEvent<Element, Event>, value: any) => void
  data: IChartDetail[]
  sx?: SxProps<Theme>
}

export default class TabSection extends Component<IProps> {
  a11yProps = (index: number) => ({ id: `detail-tab-${index}`, 'aria-controls': `detail-tabpanel-${index}` })

  render() {
    return (
      <Tabs
        sx={this.props.sx}
        value={this.props.selectedIndex}
        onChange={this.props.onChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs"
      >
        {this.props.data.map((e, i) => (
          <CustomTab key={i} label={e.title} {...this.a11yProps(i)} />
        ))}
      </Tabs>
    )
  }
}

const CustomTab = styled(Tab)({
  textTransform: 'unset',
  fontWeight: '700',
  paddingBottom: 0,
})
