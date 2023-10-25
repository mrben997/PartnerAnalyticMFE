export type TKindOptionType = 'Channel' | 'Video'

interface ISelectMenu {
  id: TKindOptionType
  title: string
}

class KindOptionBase {
  data: ISelectMenu[]
  constructor() {
    this.initial()
  }

  private initial = () => {
    this.data = [
      { id: 'Channel', title: 'Channels' },
      { id: 'Video', title: 'Videos' }
    ]
  }
}

const KindOption = new KindOptionBase()
export default KindOption
