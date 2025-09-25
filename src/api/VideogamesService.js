import { AxiosService } from "./axiosService";

export class VideogamesService {

    axios = new AxiosService()

    async fetchVideogames(){
        try {
            const { data } = await this.axios.instance.get(`${this.axios.url}`)
            
            return data ?? []
        } catch {
            return new Error('No se pudieron obtener los juegos')
        }
    }
}