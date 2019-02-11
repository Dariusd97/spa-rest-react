import axios from 'axios'
import {EventEmitter} from 'fbemitter'
import ArtistClass from './ArtistClass'

const SERVER='https://web-practice-dobredarius.c9users.io'

const DevianHotURL='https://www.deviantart.com/api/v1/oauth2/browse/hot?access_token='
const DevianPopularURL='https://www.deviantart.com/api/v1/oauth2/browse/popular?access_token='
const DevianNewestURL='https://www.deviantart.com/api/v1/oauth2/browse/newest?access_token='
const DevianDailyURL='https://www.deviantart.com/api/v1/oauth2/browse/dailydeviations?access_token='

const CLIENT_ID = 'client_id'
const CLIENT_SECRET = 'client_secret'

async function testToken(){
    let tokenExistent = await axios(`${SERVER}/tokens`);
    try{
        //placebo call to verify if the token is valid
        await axios(`https://www.deviantart.com/api/v1/oauth2/placebo?access_token=${tokenExistent.data['token']}`)
    }catch(e){
        // if not, request another one
        let tokenRequest = await axios(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`)
        
        await axios.put(`${SERVER}/tokens/1`,{token:tokenRequest.data['access_token']})
        console.warn(e)
    }
}

class DeviationsStore{
    constructor(){
        this.hotContent = []
        this.popularContent = []
        this.newestContent = []
        this.dailyContent = []
        this.emitter = new EventEmitter()
    }
    async getDevianDaily(){
        try{
            await testToken()
           
            let token = await axios(`${SERVER}/tokens`);
            let response = await axios(`${DevianDailyURL}${token.data["token"]}`)
            
            let artist;
            let arrayOfObjects=[]
            for(var i = 0;i<response.data['results'].length;i++){
                if(response.data['results'][i]['content']!=null && response.data['results'][i]['author']!=null && response.data['results'][i]['category']!=null &&response.data['results'][i]['stats']!=null){
                artist = new ArtistClass(response.data['results'][i]['author']['username'],response.data['results'][i]['content']['src'],response.data['results'][i]['category'],response.data['results'][i]['stats']['comments'],response.data['results'][i]['stats']['favourites'])
                arrayOfObjects.push(artist)
                }
            }
            this.dailyContent = arrayOfObjects
            this.emitter.emit('GET_ALL_SUCCESS')
        }catch(e){
            console.warn(e)
            this.emitter.emit("GET_ALL_ERROR");
        }
    }
    
    async getDevianHot(){
        try{
            await testToken()
            let token = await axios(`${SERVER}/tokens`);
            let response = await axios(`${DevianHotURL}${token.data["token"]}&limit=50`)
            let artist;
            let arrayOfObjects=[]
            for(var i = 0;i<response.data['results'].length;i++){
                if(response.data['results'][i]['content']!=null && response.data['results'][i]['author']!=null && response.data['results'][i]['category']!=null &&response.data['results'][i]['stats']!=null){
                artist = new ArtistClass(response.data['results'][i]['author']['username'],response.data['results'][i]['content']['src'],response.data['results'][i]['category'],response.data['results'][i]['stats']['comments'],response.data['results'][i]['stats']['favourites'])
                arrayOfObjects.push(artist)
                }
            }
            this.hotContent = arrayOfObjects
            this.emitter.emit('GET_ALL_SUCCESS')
        }catch(e){
            console.warn(e)
            this.emitter.emit("GET_ALL_ERROR");
        }
    }
   
    async getDevianPopular(){
        try{
            await testToken()
            let token = await axios(`${SERVER}/tokens`);
            let response = await axios(`${DevianPopularURL}${token.data["token"]}&limit=50`)
            let artist;
            let arrayOfObjects=[]
            for(var i = 0;i<response.data['results'].length;i++){
                if(response.data['results'][i]['content']!=null && response.data['results'][i]['author']!=null && response.data['results'][i]['category']!=null &&response.data['results'][i]['stats']!=null){
                    artist = new ArtistClass(response.data['results'][i]['author']['username'],response.data['results'][i]['content']['src'],response.data['results'][i]['category'],response.data['results'][i]['stats']['comments'],response.data['results'][i]['stats']['favourites'])
                    arrayOfObjects.push(artist)
                }
            }
            this.popularContent = arrayOfObjects
            this.emitter.emit('GET_ALL_SUCCESS')
        }catch(e){
            console.warn(e)
            this.emitter.emit('GET_ALL_ERROR')
        }
    }
    
    async getDevianNewest(){
        try{
            await testToken()
            let token = await axios(`${SERVER}/tokens`);
            let response = await axios(`${DevianNewestURL}${token.data["token"]}&limit=50`)
            let artist;
            let arrayOfObjects=[]
            for(var i = 0;i<response.data['results'].length;i++){
                if(response.data['results'][i]['content']!=null && response.data['results'][i]['author']!=null && response.data['results'][i]['category']!=null &&response.data['results'][i]['stats']!=null){
                    artist = new ArtistClass(response.data['results'][i]['author']['username'],response.data['results'][i]['content']['src'],response.data['results'][i]['category'],response.data['results'][i]['stats']['comments'],response.data['results'][i]['stats']['favourites'])
                    arrayOfObjects.push(artist)
                }
            }
            this.newestContent = arrayOfObjects
            this.emitter.emit('GET_ALL_SUCCESS')
        }catch(e){
            console.warn(e)
            this.emitter.emit('GET_ALL_ERROR')
        }
    }
}

export default DeviationsStore
