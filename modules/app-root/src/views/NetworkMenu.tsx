import React, { Component } from 'react'
import { Box, Button, Menu, MenuItem, SxProps, Theme, Typography, styled } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { ENetwork } from '../utils/type'
import { NetworkReduxProps } from '../redux/type'

interface IProps extends NetworkReduxProps {
  hoverDisabled?: boolean
  sx?: SxProps<Theme>
}
interface IState {
  anchorEl?: HTMLElement | null
}
export class NetworkMenu extends Component<IProps, IState> {
  menuData: ENetwork[]
  constructor(props: IProps) {
    super(props)
    this.state = { anchorEl: null }
    this.menuData = Object.keys(ENetwork).map((key) => ENetwork[key]) as ENetwork[]
  }

  open = (event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })
  close = () => this.setState({ anchorEl: null })

  handleMenuItemClick = (network: ENetwork) => {
    if (network !== this.props.NetworkSelected) {
      this.props.changeNetworkSelected(network)
    }
    this.setState({ anchorEl: null })
  }

  render() {
    const sxHover: SxProps<Theme> = this.props.hoverDisabled ? {} : { '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' } }
    return (
      <>
        <CustomButton onClick={this.open} endIcon={<ArrowDropDownIcon />} sx={{ ...sxHover, ...this.props.sx }}>
          <Box component='span' className='content-btn'>
            <Typography variant='body1' component='span' sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              {this.props.NetworkSelected ?? 'Title'}
            </Typography>
          </Box>
        </CustomButton>
        <CustomMenu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.close}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{ 'aria-labelledby': 'lock-button', role: 'listbox' }}
        >
          {this.menuData.map((e, i) => (
            <MenuItem key={e} selected={e === this.props.NetworkSelected} onClick={() => this.handleMenuItemClick(e)}>
              {e}
            </MenuItem>
          ))}
        </CustomMenu>
      </>
    )
  }
}

export default NetworkMenu

const buttonWidth = '200px'

const CustomButton = styled(Button)({
  color: '#3c3c3c',
  width: buttonWidth,
  // height: '56px',
  textTransform: 'unset',
  '& .content-btn': {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
})

const CustomMenu = styled(Menu)({
  '& .MuiMenuItem-root': { width: buttonWidth },
  '& .MuiMenuItem-root.Mui-selected': { fontWeight: 600, backgroundColor: 'rgba(255, 255, 255, 0)', cursor: 'unset' },
  '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
  '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 255, 255, 0)' }
})
