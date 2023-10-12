import { JSXElementConstructor, createContext } from 'react'
import { OptionModal } from './type'

export interface IGlobalModalContext {
  ShowModal: (option: OptionModal) => void
  CloseModal: () => void
}
export const GlobalModalContext = createContext<IGlobalModalContext>({} as any)

export interface IMapGlobalModal {
  context: IGlobalModalContext
}

export const MapGlobalModalContext = (Element: JSXElementConstructor<IMapGlobalModal>) => {
  return (
    <GlobalModalContext.Consumer>
      {(context) => {
        return <Element context={context} />
      }}
    </GlobalModalContext.Consumer>
  )
}
