import React, { Component } from 'react'
import { Box, Button, Menu, MenuItem, SxProps, Theme, Typography, styled } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { INetwork } from '../../utils/type'
import { NetworkMenuReduxProps } from '../../redux'

interface IProps extends NetworkMenuReduxProps {
  hoverDisabled?: boolean
  sx?: SxProps<Theme>
}
interface IState {
  anchorEl?: HTMLElement | null
}
export class NetworkMenu extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { anchorEl: null }
  }

  open = (event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })
  close = () => this.setState({ anchorEl: null })

  getData = () => Array.from(Object.values(this.props.networks.entities) as INetwork[])
  getTitle = () => this.props.networks.entities[this.props.networkId]?.title || 'Title'

  handleMenuItemClick = (id: string) => {
    if (id !== this.props.networkId) this.props.setNetworkId(id)
    this.setState({ anchorEl: null })
  }

  render() {
    const sxHover: SxProps<Theme> = this.props.hoverDisabled ? {} : { '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' } }
    return (
      <>
        <CustomButton onClick={this.open} endIcon={<ArrowDropDownIcon />} sx={{ ...sxHover, ...this.props.sx }}>
          <Box component='span' className='content-btn'>
            <Typography variant='body1' component='span' sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              {this.getTitle()}
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
          {this.getData().map((e, i) => (
            <MenuItem key={i} selected={e.id === this.props.networkId} onClick={() => this.handleMenuItemClick(e.id)}>
              {e.title}
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
  textTransform: 'unset',
  '& .content-btn': {
    flex: 1,
    display: 'flex',
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
