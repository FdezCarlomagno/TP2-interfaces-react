import axios from 'axios'

export class AxiosService {

      url = "https://vj.interfaces.jima.com.ar/api"
    instance = axios.create({ url: this.url })

}