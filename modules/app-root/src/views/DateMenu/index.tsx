import React, { Component } from 'react'
import { Box, Button, Menu, MenuItem, SxProps, Theme, Typography, styled } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { DateMenuReduxProps } from '../../redux'
import { IDateOption } from '../../utils/type'
import DateOption from '../../utils/DateOption'

interface IProps extends DateMenuReduxProps {
  hoverDisabled?: boolean
  sx?: SxProps<Theme>
}
interface IState {
  anchorEl: HTMLElement | null
}
class DateMenu extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { anchorEl: null }
  }

  open = (event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })
  close = () => this.setState({ anchorEl: null })

  getTitle = () => this.props.dates[this.props.dateIndex]?.title || 'Title'
  getPeriod = () => {
    const temp = this.props.dates[this.props.dateIndex]?.value
    if (!temp) return ''
    return DateOption.toRangeDate(temp)
  }

  handleMenuItemClick = (_: React.MouseEvent<HTMLElement>, value: number) => {
    this.setState({ anchorEl: null })
    if (value !== this.props.dateIndex) this.props.setdateId(value)
  }

  render() {
    // console.log(this.getData())
    const sxHover: SxProps<Theme> = this.props.hoverDisabled ? {} : { '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' } }
    return (
      <>
        <CustomButton onClick={this.open} endIcon={<ArrowDropDownIcon />} sx={{ ...sxHover, ...this.props.sx }}>
          <Box component='span' className='content-btn'>
            <Typography variant='subtitle2' component='span'>
              {this.getPeriod()}
            </Typography>
            <Typography variant='body1' component='span' sx={{ fontWeight: 600 }}>
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
          {this.props.dates.map((e, i) => (
            <MenuItem key={i} selected={i !== this.props.dateIndex} onClick={(event) => this.handleMenuItemClick(event, i)}>
              {e.title}
            </MenuItem>
          ))}
        </CustomMenu>
      </>
    )
  }
}
export default DateMenu

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
  '& .MuiMenuItem-root.Mui-selected': { fontWeight: 600, backgroundColor: 'rgba(255, 255, 255, 0)', cursor: 'unset' },
  '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
  '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 255, 255, 0)' }
})
