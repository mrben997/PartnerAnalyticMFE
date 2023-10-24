import { Box, BoxProps, Fade, Skeleton, SkeletonPropsVariantOverrides } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import React, { FC } from 'react'

interface ItemWrapProps extends BoxProps {
  isLoading: boolean
  variant?: OverridableStringUnion<'text' | 'rectangular' | 'circular', SkeletonPropsVariantOverrides>
}
const SkeletonLazyWrap: FC<ItemWrapProps> = (props) => {
  const { isLoading, ...other } = props
  return (
    <Box {...other} sx={{ position: 'relative', ...(props.sx || {}) }}>
      {props.children}
      <Fade in={isLoading} unmountOnExit timeout={{ enter: 0, exit: 350 }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', background: 'white', top: 0, left: 0 }}>
          <Skeleton variant={props.variant ?? 'rectangular'} animation='wave' sx={{ height: '100%', width: '100%' }} />
        </Box>
      </Fade>
    </Box>
  )
}
export default SkeletonLazyWrap
