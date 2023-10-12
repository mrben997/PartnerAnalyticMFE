import { SxProps } from '@mui/material'

export interface OptionModal {
  sx?: SxProps
  ContenModal?: () => JSX.Element
}

export enum ContentPosition {
  Center,
}
