import { TMetric } from './SelectedProcessor/type'

export type TMetricOptionType = 'View' | 'WatchTime' | 'Money'

interface ISelectMenu {
  id: TMetricOptionType
  title: string
}

class MetricOptionBase {
  data: ISelectMenu[]
  constructor() {
    this.initial()
  }

  private initial = () => {
    this.data = [
      { id: 'View', title: 'View' },
      { id: 'WatchTime', title: 'Watch time (hours)' },
      { id: 'Money', title: 'Estimated partner revenue' }
    ]
  }

  getSortString = (params: TMetricOptionType) => `${params} desc`

  getMetricString = (index: number): TMetric => {
    switch (index) {
      case 1:
        return 'estimatedMinutesWatched'
      case 2:
        return 'estimatedRevenue'
      case 0:
      default:
        return 'views'
    }
  }
}

const MetricOption = new MetricOptionBase()
export default MetricOption
