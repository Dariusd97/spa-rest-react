import React, { Component } from 'react';
import FavoritesStore from '../stores/FavoritesStore'
import axios from 'axios'
import {EventEmitter} from 'fbemitter'

const SERVER='https://web-practice-dobredarius.c9users.io'
//const SITE = 'https://www.deviantart.com/'

class FavoritesList extends Component{
    constructor(){
        super()
        this.state = {
            favorites : []
        }
        this.store = new FavoritesStore()
        this.emitter = new EventEmitter()
    }
    
    async deleteOne(idArtist){
      try {
        await axios.delete(`${SERVER}/users/1/favorites/artists/${idArtist}`)
        this.emitter.emit('ADD_SUCCESS')
        this.store.getAllArtists()
      } catch (e) {
        console.warn(e)
        this.emitter.emit('ADD_ERROR')
      }       
    }
    
    componentDidMount(){
        this.store.getAllArtists()
        this.store.emitter.addListener('GET_ALL_SUCCESS',() => {
            this.setState({
                favorites:this.store.content
            })
        })
    }
    
    render(){
        return(
            
            <table  style={{backgroundColor:"#F0F8FF",display:'block'}} >
                <tbody >
                <tr >
                    <th style={{width:"30%",textDecoration: 'underline'}} className="tableFav">Artist name</th>
                    <th style={{width:"30%",textDecoration: 'underline'}} className="tableFav">Profile</th>
                    <th style={{width:"30%",textDecoration: 'underline'}}></th>
                </tr>
                {
                    this.state.favorites.map((e, i) => 
                    
                         <tr key={i} style={{width:400}}>
                            <th>{e.name}</th> 
                            <th><a href={e.link} target={e.link}>{e.link}</a></th>
                            <th>
                                <input type="button" value="delete" onClick={() => this.deleteOne(e.idArtist)} />
                            </th>
                         
                   </tr>)
                }
             </tbody>
            </table>
        )
    }
}

export default FavoritesList