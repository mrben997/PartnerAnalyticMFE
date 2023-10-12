import { createContext } from 'react'

export interface IAvancedModeState {
  isOpen: boolean
  selectedIndex: number
}
export type TAvancedModeOpen = () => void
export type TAvancedModeClose = (event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => void
export interface IAvancedModeContext {
  state: IAvancedModeState
  open: TAvancedModeOpen
  close: TAvancedModeClose
}
export const AvancedModeContext = createContext<IAvancedModeContext>({} as any)
