import React, { Component, ReactNode } from 'react'
import { Menu, MenuItem, styled } from '@mui/material'
import { ISelectMenu } from './type'

interface IProps {
  widthPC: string
  widthMobile: string
  data: ISelectMenu[]
  selectedIndex: number
  onSelected?: (params: number) => void
  children: (open: (event: React.MouseEvent<HTMLElement>) => void) => ReactNode
}
interface IState {
  anchorEl?: HTMLElement | null
}
export default class SelectMenu extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { anchorEl: null }
  }

  open = (event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })

  close = () => this.setState({ anchorEl: null })

  handleMenuItemClick = (value: number) => {
    if (value !== this.props.selectedIndex && this.props.onSelected) this.props.onSelected(value)
    this.setState({ anchorEl: null })
  }

  renderChildren = () => {
    const children = this.props.children
    if (typeof children === 'function') return children(this.open)
    return <></>
  }

  render() {
    return (
      <>
        {this.renderChildren()}
        <CustomMenu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.close}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{ 'aria-labelledby': 'lock-button', role: 'listbox' }}
          widthpc={this.props.widthPC}
          widthmobile={this.props.widthMobile}
        >
          {this.props.data.map((e, i) => (
            <MenuItem key={i} selected={i === this.props.selectedIndex} onClick={() => this.handleMenuItemClick(i)}>
              {e.title}
            </MenuItem>
          ))}
        </CustomMenu>
      </>
    )
  }
}

interface ICustomMenu {
  widthpc: string
  widthmobile: string
}

const CustomMenu = styled(Menu)<ICustomMenu>(({ theme, widthpc, widthmobile }) => ({
  '& .MuiMenuItem-root': { width: widthpc },
  '& .MuiMenuItem-root.Mui-selected': { fontWeight: 600, backgroundColor: 'rgba(255, 255, 255, 0)', cursor: 'unset' },
  '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
  '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 255, 255, 0)' },
  [theme.breakpoints.down('md')]: { '& .MuiMenuItem-root': { width: widthmobile } }
}))
