import { faker } from '@faker-js/faker'
import { ChartData } from 'chart.js'
import { idDefault } from 'csmfe/helper'
import { IRowData } from './SelectedProcessor/type'
import { IChartData, INetwork, ITableData, ITopData } from '../models'

const MOUNTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface IFakeData {}

class FakeDataLocalBase implements IFakeData {
  mounthLabels: string[]
  lineChart: IChartData
  lineChartAvancedMode: IChartData
  dates: string[]
  networks: INetwork[]
  topData1: ITopData[]
  topData2: ITopData[]
  avancedMode: ChartData<'line', number[], string>
  tableTopData: ITableData[]
  initialRowData: (title?: string) => IRowData
  rowDatas: IRowData[]
  constructor() {
    this.initial()
  }

  private initial = () => {
    this.mounthLabels = MOUNTH_LABELS
    this.lineChart = {
      labels: MOUNTH_LABELS,
      details: [
        { title: 'Views', total: 0, value: this.generateLineChartValues() },
        { title: 'Watch time (hours)', total: 0, value: this.generateLineChartValues() },
        { title: 'Estimated partner revenue', total: 0, value: this.generateLineChartValues() }
      ]
    }
    this.lineChartAvancedMode = {
      labels: MOUNTH_LABELS,
      details: [
        { title: 'Content', total: 0, value: this.generateLineChartValues() },
        { title: 'Traffic source', total: 0, value: this.generateLineChartValues() },
        { title: 'Geography', total: 0, value: this.generateLineChartValues() },
        { title: 'Cities', total: 0, value: this.generateLineChartValues() },
        { title: 'View age', total: 0, value: this.generateLineChartValues() }
      ]
    }
    this.dates = ['Last 7 day', 'Last 14 day', 'Last 28 day', 'Last 90 day']
    // this.networks = this.generateNetworks()
    this.networks = []
    this.topData1 = this.generateTopData()
    this.topData2 = this.generateTopData()
    this.avancedMode = this.generateAvancedModeData()
    this.tableTopData = this.generateTableTopData()
    this.initialRowData = (title = 'title') => ({
      id: idDefault,
      title,
      views: 0,
      estimatedMinutesWatched: 0,
      estimatedRevenue: 0
    })
    this.rowDatas = this.generateRowData(30)
  }

  private generateLineChartValues = (min?: number, max?: number) => {
    return MOUNTH_LABELS.map(() => faker.number.int({ min: min ?? 0, max: max ?? 100 }))
  }

  private generateTopData = (): ITopData[] => {
    const max = faker.number.int({ min: 7, max: 10 })
    const arr: ITopData[] = []
    for (let index = 0; index < max; index++) {
      const elm: ITopData = {
        title: faker.internet.userName(),
        value: faker.number.int({ min: 0, max: 10000 }),
        imageUrl: faker.image.url()
      }
      arr.push(elm)
    }
    return arr
  }

  private generateAvancedModeData = (): ChartData<'line', number[], string> => {
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
          pointRadius: () => 0
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
          pointRadius: () => 0
        }
      ]
    }
    return data
  }

  private generateTableTopData = (): ITableData[] => {
    const arr: ITableData[] = []
    for (let index = 0; index < 20; index++) {
      arr.push({ id: 'Id-' + (index + 1), title: faker.person.fullName() })
    }
    return arr
  }

  private generateRowData = (max: number = 20) => {
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

  // private generateNetworks = () => {
  //   const arr: INetwork[] = []
  //   const types = [ENetwork.DinoCollab, ENetwork.SuperNetwork]
  //   for (let index = 0; index < 2; index++) {
  //     arr.push({
  //       id: faker.database.mongodbObjectId(),
  //       title: types[index],
  //       value: types[index]
  //     })
  //   }
  //   return arr
  // }
}
const FakeDataLocal = new FakeDataLocalBase()
export default FakeDataLocal
