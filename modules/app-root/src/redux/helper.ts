import { Dictionary } from '@reduxjs/toolkit'

export const MapAction: Dictionary<() => void> = {}

export const SetupCancel = (key: string, abort: () => void) => {
  const action = MapAction[key]
  action && action()
  MapAction[key] = abort
}

export const calculateWatchTime = (params: (string | number)[][], index): (string | number)[][] => {
  const data = params.slice()
  if (data.length < 1) return []
  data.forEach((elm) => {
    elm[index] = (elm[index] as number) / 60
  })
  return data
}
