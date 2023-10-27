import React, { FC } from 'react'
import { Box, BoxProps, Fade, Skeleton, SkeletonPropsVariantOverrides, SxProps, Theme, Typography, styled } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { LazyStatus } from '../../redux'

interface IProps extends BoxProps {
  status: LazyStatus
  variant?: OverridableStringUnion<'text' | 'rectangular' | 'circular', SkeletonPropsVariantOverrides>
  sxSkeleton?: SxProps<Theme>
}
const SkeletonLazyWrap: FC<IProps> = (props) => {
  const { status, sxSkeleton, ...other } = props
  return (
    <Box {...other} sx={{ position: 'relative', ...(props.sx || {}) }}>
      {props.children}
      <Fade in={status === LazyStatus.Loading} unmountOnExit timeout={{ enter: 0, exit: 350 }}>
        <Wrapper>
          <Skeleton
            variant={props.variant ?? 'rectangular'}
            animation='wave'
            sx={{ height: '100%', width: '100%', ...sxSkeleton }}
          />
        </Wrapper>
      </Fade>
      <Fade in={status === LazyStatus.Error} unmountOnExit timeout={{ enter: 0, exit: 350 }}>
        <Wrapper>
          <Typography sx={{ color: '#f10000' }}>An error has occurred!</Typography>
        </Wrapper>
      </Fade>
    </Box>
  )
}
export default SkeletonLazyWrap

const Wrapper = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  top: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100
})
