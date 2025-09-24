import { AxiosService } from "./axiosService";

export class VideogamesService {

    axios = new AxiosService()

    async fetchVideogames(){
        try {
            const { data } = await this.axios.instance.get(`${this.axios.url}/videogames`)
            
            return data ?? []
        } catch {
            return new Error('No se pudieron obtener los juegos')
        }
    }

    async getVideogameById(id){
        try {
            const { data } = await this.axios.instance.get(`${this.axios.url}/videogames/${id}`)
            
            return data ?? null
        } catch {
            return new Error('No se pudo obtener el videojuego con id: ', id)
        }
    }
}