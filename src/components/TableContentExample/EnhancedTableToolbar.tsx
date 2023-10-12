import React, { Component } from 'react'
import { alpha, Toolbar, Typography, Theme } from '@mui/material'

interface IProps {
  numSelected: number
}

export default class EnhancedTableToolbar extends Component<IProps> {
  getConfig = () => {
    if (this.props.numSelected < 1) return {}
    return { bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }
  }

  render() {
    return <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...this.getConfig() }}>{this.renderContent()}</Toolbar>
  }

  renderContent = () => {
    if (this.props.numSelected > 0) {
      return (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {this.props.numSelected} selected
        </Typography>
      )
    }
    return (
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
        Details
      </Typography>
    )
  }
}
