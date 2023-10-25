interface ISelectMenu {
  id: string
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
      { id: 'Money', title: 'Estimated partner revenue' },
      { id: 'WatchTime', title: 'Watch time (hours)' }
    ]
  }
}

const MetricOption = new MetricOptionBase()
export default MetricOption
