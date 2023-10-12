import { faker } from '@faker-js/faker'
import { IMapSelected, IMapSelecteds, IRowData } from './type'
import { Dictionary } from '@reduxjs/toolkit'

export const colors = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe'
]

export const convertMapSelectToColors = (params: IMapSelecteds) => {
  const arr = Object.values(params.map) as IMapSelected[]
  return arr.filter((e) => !!e.color).map((e) => e.color) as string[]
}

export const getUnusedColor = (id: string, params: IMapSelecteds): string | undefined => {
  const select = params.map[id]
  if (select && select.color) select.color
  const colorActives = convertMapSelectToColors(params)
  if (params.colors.length === colorActives.length) return
  const colorExist = new Set(colorActives)
  return params.colors.find((e) => !colorExist.has(e))
}

export const generateRowData = (max: number = 20) => {
  const arr: IRowData[] = []
  for (let index = 0; index < max; index++) {
    arr.push({
      id: faker.database.mongodbObjectId(),
      title: faker.person.fullName(),
      views: faker.number.int({ min: 0, max: 10000 }),
      estimatedMinutesWatched: faker.number.int({ min: 0, max: 10000 }),
      estimatedRevenue: faker.number.int({ min: 0, max: 10000 })
    })
  }
  return arr
}
