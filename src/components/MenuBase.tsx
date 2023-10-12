import React, { Component } from 'react'
import { Box, Button, Menu, MenuItem, SxProps, Theme, Typography, styled } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

interface IProps {
  data: string[]
  hoverDisabled?: boolean
  sx?: SxProps<Theme>
}
interface IState {
  selectedIndex: number
  anchorEl?: HTMLElement | null
}
export default class DateMenu extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { selectedIndex: 0 }
  }

  open = (event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })
  close = () => this.setState({ anchorEl: null })

  handleMenuItemClick = (_: React.MouseEvent<HTMLElement>, index: number) => {
    this.setState({ selectedIndex: index, anchorEl: null })
  }

  render() {
    const menuData = this.props.data
    const selectedData = this.props.data[this.state.selectedIndex]
    const sxHover: SxProps<Theme> = this.props.hoverDisabled ? {} : { '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' } }
    return (
      <>
        <CustomButton onClick={this.open} endIcon={<ArrowDropDownIcon />} sx={{ ...sxHover, ...this.props.sx }}>
          <Box className='content-btn'>
            <Typography variant='subtitle2' component='span'>
              Start date - End date
            </Typography>
            <Typography variant='body1' component='span' sx={{ fontWeight: 600 }}>
              {selectedData ?? 'Title'}
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
          {menuData.map((e, i) => (
            <MenuItem key={e} selected={i === this.state.selectedIndex} onClick={(event) => this.handleMenuItemClick(event, i)}>
              {e}
            </MenuItem>
          ))}
        </CustomMenu>
      </>
    )
  }
}

const buttonWidth = '220px'

const CustomButton = styled(Button)({
  color: '#3c3c3c',
  width: buttonWidth,
  height: '56px',
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
  '& .MuiMenuItem-root.Mui-selected': { fontWeight: 600 },
  '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' },
  '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 255, 255, 0)' }
})
