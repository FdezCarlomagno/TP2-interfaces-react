import axios from 'axios'

export class AxiosService {

    url = "https://api"
    instance = axios.create({ url: this.url })

}