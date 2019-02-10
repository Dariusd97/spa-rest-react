import axios from 'axios'
import {EventEmitter} from 'fbemitter'

const SERVER="https://web-practice-dobredarius.c9users.io";

class FavoritesStore{
    constructor(){
        this.content = []
        this.emitter = new EventEmitter()
    }
    async getAllArtists(){
        try{
            let response = await axios(`${SERVER}/users/1/favorites/artists`)
            this.content = response.data['artists']
            this.emitter.emit('GET_ALL_SUCCESS')
        }catch(e){
            console.warn(e)
            this.emitter.emit("GET_ALL_ERROR");
        }
    }
}

export default FavoritesStore