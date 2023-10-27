/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartData } from 'chart.js'
import { IChartData } from '../models'

type TGenerateLineChartDataFunc = (parmas: IChartData, index: number) => ChartData<'line', number[], string>
export const GenerateLineChartData: TGenerateLineChartDataFunc = ({ labels, details }, index) => {
  return {
    labels: labels ?? [],
    datasets: [
      {
        label: details[index]?.title ?? 'No name',
        data: details[index]?.value ?? [],
        fill: { target: 'origin', above: 'rgb(154 208 245 / 30%)' },
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 0.85)',
        borderWidth: 2,
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'white'
      }
    ]
  }
}

const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item)

export function MergeDeep<TModel = any>(target: any, ...sources: any[]): TModel {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        MergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return MergeDeep(target, ...sources)
}

export const hummanDate = (value: string) => `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`

export const cutStringToWidth = (str: string, width: number) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return str
  context.font = '14px Arial'

  let newStr = str
  let isCheck = false
  while (context.measureText(newStr).width > width) {
    newStr = newStr.slice(0, -1)
    isCheck = true
  }

  if (isCheck) {
    newStr += '...'
  }

  while (context.measureText(newStr).width < width) {
    newStr += ' '
  }

  return newStr
}

export const getThumbnailYoutube = (id: string, imageUrl?: string) => {
  if (imageUrl) return imageUrl
  return `https://i.ytimg.com/vi/${id}/default.jpg`
}
