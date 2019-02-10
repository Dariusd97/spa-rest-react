import React, { Component } from 'react';
import DeviationsStore from '../stores/DeviationsStore'
import axios from 'axios'
import {EventEmitter} from 'fbemitter'

const SERVER='https://web-practice-dobredarius.c9users.io'
const SITE = 'https://www.deviantart.com/'

class DeviationHotList extends Component{
    constructor(){
        super()
        this.state = {
            hotDeviations : []
        }
        this.store = new DeviationsStore()
        this.emitter = new EventEmitter()
    }
    
    async addOne(artistName,image,category){
      try {
           // artist name
        let link = SITE.concat(artistName)
        await axios.post(`${SERVER}/users/1/favorites/artists`,{ name: artistName,link:link})
      
        //get all artists
        let artist = await axios(`${SERVER}/users/1/favorites/artists`)
        let idArtist
       
        for(var i = 0; i< artist['data']['artists'].length;i++){
            if(artist['data']['artists'][i]['name'] === artistName && artist['data']['artists'][i]['link'] === link){
                idArtist=artist['data']['artists'][i]['idArtist']
            }
        }
        //image
        await axios.post(`${SERVER}/users/1/favorites/artists/${idArtist}/paintings`,{name:image})
        this.emitter.emit('ADD_SUCCESS')
        
        this.emitter.emit('ADD_SUCCESS')
      } catch (e) {
        console.warn(e)
        this.emitter.emit('ADD_ERROR')
      }       
    }
    
    componentDidMount(){
        this.store.getDevianHot()
        this.store.emitter.addListener('GET_ALL_SUCCESS',() => {
            this.setState({
                hotDeviations:this.store.hotContent
            })
        })
    }
    
    render(){
        return(
            <table  style={{backgroundColor:"#F0F8FF",display:'block'}}>
                <tbody >
                <tr >
                    <th style={{width:"20%",textDecoration: 'underline'}}>Artist name</th>
                    <th style={{width:"20%",textDecoration: 'underline'}}>Category</th>
                    <th style={{width:"20%",textDecoration: 'underline'}}>Comments</th>
                    <th style={{width:"20%",textDecoration: 'underline'}}>Likes</th>
                    <th style={{width:"20%",textDecoration: 'underline'}}>Image</th>
                </tr>
                {
                    this.state.hotDeviations.map((e,i) => 
                    <tr key={i} style={{width:400}}>
                        <th>{e.username}</th>
                        <th>{e.category}</th>
                        <th>{e.comments}</th>
                        <th>{e.favorites}</th> 
                        <th>
                            <img src={e.image} alt="" width="100px" height="100px" style={{borderRadius:'50%'}}/>
                        </th>
                        <th>
                            <input type="button" value="add" onClick={() => this.addOne(e.username,e.image,e.category)} />
                        </th>
                    </tr>)
                }
                </tbody>
            </table>)
    }
}

export default DeviationHotList