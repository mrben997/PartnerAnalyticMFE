import React, { FC, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
  Filler,
  ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import { faker } from '@faker-js/faker'
import { MergeDeep } from '../utils/helper'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  // Title,
  Tooltip,
  Filler,
  Legend,
  {
    id: 'uniqueid5', //typescript crashes without id,
    afterDraw: (chart, easing) => {
      const activePoints = chart.tooltip?.getActiveElements() ?? []
      if (activePoints.length) {
        const activePoint = activePoints[0]
        const ctx = chart.ctx
        const x = activePoint.element.x
        const topY = chart.scales.y?.top
        const bottomY = chart.scales.y?.bottom
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 1
        ctx.strokeStyle = '#a5b4c3'
        ctx.stroke()
        ctx.restore()
      }
    }
  }
)

export const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  // elements: {
  //     line: {
  //         tension: 0.1  // smooth lines,
  //     },
  // },
  hover: {
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top' as const
    }
    // title: {
    //     display: true,
    //     text: 'Chart.js Bar Chart',
    // },
    // tooltip: {
    //     callbacks: {
    //         label: function (context) {
    //             let label = context.label || context.dataset.label || '';
    //             if (label) {
    //                 label += ': ';
    //             }
    //             if (context.parsed.y !== null) {
    //                 label += FormatterUSD().format(context.parsed.y);
    //             }
    //             return label;
    //         }
    //     }
    // },
  },
  scales: {
    // "yAxes": {
    //     ticks: {
    //         callback: function (value, index, values) {
    //             return FormatterUSD().format(value as number)
    //         }
    //     }
    // }
    x: {
      ticks: {
        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
        callback: function (val, index, ticks) {
          const amount = Math.floor(ticks.length / 6)
          // Hide every amount  tick label
          return index % amount === 0 ? (typeof val === 'string' ? val : this.getLabelForValue(val)) : null
        },
        maxRotation: 0,
        align: 'inner'
      }
    }
  }
}

export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const data = {
  labels: monthLabels,
  datasets: [
    {
      label: 'Dataset 1',
      data: monthLabels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'Dataset 2',
      data: monthLabels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
}

interface LineChartProps {
  width?: number | string
  height?: number | string
  data: ChartData<'line', number[], string>
  options?: ChartOptions<'line'>
}
export const LineChart: FC<LineChartProps> = (props) => {
  const { data, options: optionProps, ...other } = props
  const [opt] = useState(MergeDeep<ChartOptions<'line'>>({}, options, optionProps ?? {}))
  return <Line options={opt} data={data} {...other} />
}
