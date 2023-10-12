import { CreateTableTemplate, MapOperators, TableFormatter } from '../components/TableTemplate'
import { ITableData } from '../core/type'

const CreateTable = () => {
  return CreateTableTemplate<ITableData>('Server', {
    getRowId: (x) => x.id,
    config: {
      id: { flex: 1, minWidth: 150, type: 'string', headerName: 'Id' },
      title: {
        flex: 1,
        minWidth: 100,
        type: 'string',
        headerName: 'Title',
        renderCell: (params) => TableFormatter.tooltip(params.value),
      },
    },
    filterOperators: MapOperators, //server mode
  })
}
export default CreateTable
