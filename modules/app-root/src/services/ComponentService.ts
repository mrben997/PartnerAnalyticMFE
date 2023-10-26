import { CreateHttpService, ServiceBase } from 'graphql-service-mfe'
import { IMediaNetwork } from '../models'

class ComponentServiceBase extends ServiceBase {
  constructor() {
    super(CreateHttpService(`${window.location.origin}/api/Component`))
  }
  _UrlAllMediaNetwork = 'AllMediaNetwork'
  AllMediaNetwork = async (signal?: AbortSignal): Promise<IMediaNetwork[]> => {
    return this.Get<IMediaNetwork[]>(this._UrlAllMediaNetwork, { signal })
  }
}
const ComponentService = new ComponentServiceBase()
export default ComponentService
