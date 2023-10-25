import { Dictionary } from '@reduxjs/toolkit'

export const MapAction: Dictionary<() => void> = {}

export const SetupCancel = (key: string, abort: () => void) => {
  const action = MapAction[key]
  action && action()
  MapAction[key] = abort
}
