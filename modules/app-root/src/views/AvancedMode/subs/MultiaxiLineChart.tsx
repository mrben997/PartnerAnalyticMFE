import React, { Component } from 'react'
import { Dictionary } from '@reduxjs/toolkit'
import { formatNumber, formatterUSD } from 'csmfe/helper'
import { IDataInfo } from '../../../models'
import { LineChart } from '../../../components/LineChart'
import { TLineChart } from '../../../utils/LineChartProcessor'
import { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { cutStringToWidth, hummanDate } from '../../../utils/helper'
import { TRowDataProperty, TSelectedProcessorMaping, totalColorDefault, totalIdDefault } from '../../../utils/SelectedProcessor'
import MetricOption from '../../../utils/MetricOption'
import SelectedProcessor from '../../../utils/SelectedProcessor'

interface IDataResult {
  label?: string
  data: number[]
  color?: string
}
interface IProps {
  dates: TRowDataProperty[]
  lineChart: TLineChart
  metricIndex: number
  tableDataMaping: TSelectedProcessorMaping
  tableDataMapingDefault: TSelectedProcessorMaping
  info: Dictionary<IDataInfo>
}

export default class MultiaxiLineChart extends Component<IProps> {
  getLabels = () => this.props.dates.map((e) => hummanDate(e.toString()))

  getTotalData = (): IDataResult | undefined => {
    const { dates, tableDataMaping, lineChart, metricIndex } = this.props
    const metric = MetricOption.getMetricString(metricIndex)
    const row = tableDataMaping[totalIdDefault]
    if (!row || !row.checked) return
    const data = dates.map<number>((date) => {
      const lc = lineChart[totalIdDefault]
      return ((lc && lc[date]?.[metric]) as number) ?? 0
    })
    return { color: row.color ?? totalColorDefault, label: totalIdDefault, data }
  }

  getDatas = (): IDataResult[] => {
    const { dates, lineChart, metricIndex } = this.props
    const metric = MetricOption.getMetricString(metricIndex)

    const totalData = this.getTotalData()
    let isDefault = false

    let maping = this.props.tableDataMaping
    let ids = SelectedProcessor.getIdActives(maping, true)
    if (ids.length < 1 || (ids.length < 2 && totalData)) {
      maping = this.props.tableDataMapingDefault
      ids = Object.keys(maping) as string[]
      isDefault = true
    }
    let dataResult = ids.map<IDataResult>((id) => {
      const item = maping[id]
      const data = dates.map<number>((date) => {
        const lc = lineChart[id]
        return ((lc && lc[date]?.[metric]) as number) ?? 0
      })
      const label = (this.props.info[item?.row.id ?? '']?.Snippet.Title ?? item?.row.id) as string
      return { color: item?.color, label, data }
    })
    if (isDefault && totalData) dataResult = [totalData, ...dataResult]
    return dataResult
  }

  generateLineChartData = (): ChartData<'line', number[], string> => {
    const datasets = this.getDatas().map((item) => ({
      label: cutStringToWidth(item.label ?? 'None', 200),
      data: item.data,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: item.color,
      borderWidth: 2,
      pointBorderColor: item.color,
      pointBackgroundColor: item.color,
      pointHoverBackgroundColor: 'rgb(255, 99, 132)',
      pointHoverBorderColor: 'white',
      pointRadius: () => 0
    }))
    return { labels: this.getLabels(), datasets }
  }

  customLabel(context: TooltipItem<'line'>) {
    const label = context.dataset.label
    let value = context.dataset.data[context.dataIndex] + ''
    if (this.props.metricIndex === 2) value = formatterUSD().format(parseFloat(value))
    else value = formatNumber.format(parseInt(value))
    return ` ${label}:ㅤ${value}` // eslint-disable-line
  }

  getOption = (): ChartOptions<'line'> => ({
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => this.customLabel(context) }, textDirection: 'ltr' }
    },
    scales: { y: { beginAtZero: true } }
  })

  render() {
    return <LineChart options={this.getOption()} data={this.generateLineChartData()} />
  }
}
