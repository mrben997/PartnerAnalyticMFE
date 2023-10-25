/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'

export type TAvancedModeOpen = () => void
export type TAvancedModeClose = (event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => void
export interface IAvancedModeContext {
  open: TAvancedModeOpen
  close: TAvancedModeClose
}
export const AvancedModeContext = createContext<IAvancedModeContext>({} as any)
