import React, { Component } from 'react'
import { humanNumber } from 'csmfe/helper'
import { Box, Typography, styled } from '@mui/material'
import { ITopData, ITopDataConfig, ITopDataDTO } from '../utils/type'

const configDefault: ITopDataConfig = {
  title: 'Top data title',
  date: 'Start date - End date',
  measure: 'Views'
}

interface IProps {
  config?: ITopDataConfig
  data: ITopData[]
}

export class TopData extends Component<IProps> {
  findMax = (data: ITopData[]): ITopData | null => {
    if (data.length < 1) return null
    return data.reduce((max, current) => (current.value > max.value ? current : max))
  }

  coverData = (data: ITopData[]): ITopDataDTO[] => {
    const max = this.findMax(data)?.value || 0
    const arr = data.map<ITopDataDTO>((e) => ({ ...e, percent: (e.value * 100) / max }))
    return arr.sort((a, b) => b.value - a.value)
  }

  render() {
    const { config = configDefault } = this.props
    return (
      <Box sx={{ minHeight: '300px' }}>
        <Box>
          <Typography component='h3' variant='h6' sx={{ fontWeight: 500 }}>
            {config.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: '12px' }}>
            <Typography component='span' variant='subtitle2' sx={{ flex: 1, fontWeight: 500 }}>
              {config.date}
            </Typography>
            <Typography component='span' variant='subtitle2' sx={{ fontWeight: 500, width: widthAmount }}>
              {config.measure}
            </Typography>
          </Box>
        </Box>
        {this.coverData(this.props.data).map(this.renderItem)}
      </Box>
    )
  }

  renderItem = (e: ITopDataDTO, i: number) => {
    return (
      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '12px', mt: '12px' }}>
        <Box
          component='img'
          src={e.imageUrl}
          alt='thumbnail'
          sx={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
        />
        {/* <img
          alt='VideoThumb'
          src={`/api/user/v2/YoutubeReport/VideoThumb?Id=${'iswFOvqpcSc'}`}
          style={{ width: '50px', marginRight: '10px', borderRadius: '5px' }}
        /> */}
        <Typography noWrap sx={{ flex: 1 }}>
          {e.title}
        </Typography>
        <Line percent={e.percent} />
        <Typography component='span' variant='subtitle1' sx={{ width: widthAmount }}>
          {humanNumber(e.value)}
        </Typography>
      </Box>
    )
  }
}
export default TopData

const widthAmount = '64px'

const Line = styled(Box)<{ percent?: number }>(({ percent }) => ({
  width: '100%',
  maxWidth: '140px',
  height: '8px',
  position: 'relative',
  backgroundColor: '#eeeeee',
  borderRadius: '4px',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: (percent || 0) + '%',
    display: 'block',
    backgroundColor: '#1a90ff'
  }
}))
