import { faker } from '@faker-js/faker'
import { IChartData, ITableData, ITopData } from './type'
import { ChartData } from 'chart.js'

interface IFakeData {
  mounthLabels: string[]
  lineChart: IChartData
  lineChartAvancedMode: IChartData
  dates: string[]
  networks: string[]
  topData1: ITopData[]
  topData2: ITopData[]
  avancedMode: ChartData<'line', number[], string>
  tableTopData: ITableData[]
}

const MOUNTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const generateValues = (min?: number, max?: number) => {
  return MOUNTH_LABELS.map(() => faker.number.int({ min: min ?? 0, max: max ?? 100 }))
}

const generateTopData = (): ITopData[] => {
  const max = faker.number.int({ min: 7, max: 10 })
  let arr = []
  for (let index = 0; index < max; index++) {
    const elm: ITopData = {
      title: faker.internet.userName(),
      value: faker.number.int({ min: 0, max: 10000 }),
      imageUrl: faker.image.url(),
    }
    arr.push(elm)
  }
  return arr
}

const genarateAvancedModeData = (): ChartData<'line', number[], string> => {
  const colors = ['#ff200c', '#00d300']
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data: ChartData<'line', number[], string> = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Dataset 1',
        data: monthLabels.map(() => faker.number.int({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: colors[0],
        borderWidth: 2,
        pointBorderColor: colors[0],
        pointBackgroundColor: colors[0],
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'white',
        pointRadius: (ctx, options) => 0,
      },
      {
        label: 'Dataset 2',
        data: monthLabels.map(() => faker.number.int({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: colors[1],
        borderWidth: 2,
        pointBorderColor: colors[1],
        pointBackgroundColor: colors[1],
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'white',
        pointRadius: (ctx, options) => 0,
      },
    ],
  }
  return data
}

const genarateTableTopData = (): ITableData[] => {
  let arr: ITableData[] = []
  for (let index = 0; index < 20; index++) {
    arr.push({ id: 'Id-' + (index + 1), title: faker.person.fullName() })
  }
  return arr
}

const FAKEDATA: IFakeData = {
  mounthLabels: MOUNTH_LABELS,
  lineChart: {
    labels: MOUNTH_LABELS,
    details: [
      { title: 'Views', total: 0, value: generateValues() },
      { title: 'Watch time (hours)', total: 0, value: generateValues() },
      { title: 'Estimated partner revenue', total: 0, value: generateValues() },
    ],
  },
  lineChartAvancedMode: {
    labels: MOUNTH_LABELS,
    details: [
      { title: 'Content', total: 0, value: generateValues() },
      { title: 'Traffic source', total: 0, value: generateValues() },
      { title: 'Geography', total: 0, value: generateValues() },
      { title: 'Cities', total: 0, value: generateValues() },
      { title: 'View age', total: 0, value: generateValues() },
    ],
  },
  dates: ['Last 7 day', 'Last 14 day', 'Last 28 day', 'Last 90 day'],
  networks: ['Dino Collab', 'Super Super Network'],
  topData1: generateTopData(),
  topData2: generateTopData(),
  avancedMode: genarateAvancedModeData(),
  tableTopData: genarateTableTopData(),
}

export default FAKEDATA
