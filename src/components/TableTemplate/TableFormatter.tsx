import React from 'react'
import { Chip, Stack, Tooltip, TooltipProps, Typography, TypographyProps, styled, tooltipClasses } from '@mui/material'

class TableFormatterBase {
  _parseArray = (args: string) => {
    try {
      const arr = JSON.parse(args ?? 'error')
      if (Array.isArray(arr)) return arr
      else return []
    } catch (error) {
      return []
    }
  }

  date = (args: string) => new Date(args).toLocaleString()

  tooltip = (args: string) => {
    if (!args) return <></>
    return (
      <Tooltip title={args} placement='top'>
        <Typography noWrap>{args}</Typography>
      </Tooltip>
    )
  }

  arrayChip = (args: string, name: string) => {
    const arr = this._parseArray(args)
    const temps = arr.reduce((a: string[], b: string) => {
      a.push(...b.split(/\W+/))
      return a
    }, [])
    return this.chips(temps, name)
  }

  chips = (args: string[], name: string) => {
    const chipElements = args.map((e, i) => (
      <Chip key={i} label={e} size='small' variant='outlined' sx={{ '& .MuiChip-label': { mt: '2px' } }} />
    ))
    return (
      <HtmlTooltip
        placement='bottom'
        title={
          <Stack sx={{ gap: '4px', py: '6px', minWidth: '200px', maxWidth: '400px ' }}>
            <TooltipHeaderText>{name}</TooltipHeaderText>
            <Stack direction='row' spacing={1} sx={{ gap: '4px', flexWrap: 'wrap' }}>
              {chipElements}
            </Stack>
          </Stack>
        }
      >
        <Stack
          direction='row'
          sx={{ gap: '4px', flex: 1, alignItems: 'center', height: '100%', width: '100%', overflow: 'hidden' }}
        >
          {chipElements}
        </Stack>
      </HtmlTooltip>
    )
  }
}
export const TableFormatter = new TableFormatterBase()
export default TableFormatter

const TooltipHeaderText = styled((props: TypographyProps) => <Typography variant='subtitle1' {...props} />)({
  color: '#0095ff',
  fontWeight: 700
})

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    minHeight: 120,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))
