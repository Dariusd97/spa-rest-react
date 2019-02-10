import React, { Component } from 'react'


class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
    	isLogin:true,
      user:{
      	username:"",
      	password:""
      }
    }
  }
  
  handleChange = event =>{
  	this.setState({
  		[event.target.id]:event.target.value
  	})
  }
  handleSubmit = event =>{
  	event.preventDefault()
  }
  
  render() {
      return (
      	<form action="/action_page.php">
  				<div className="imgcontainer">
    				<img src="http://www.aplithelp.com/wp-content/uploads/2014/11/arts.jpg" alt="Avatar" className="avatar"/>
  				</div>
  				<div className="container">
    				<label htmlFor="uname"><b>Username</b></label>
    				<input type="text" placeholder="Enter Username" name="uname" required/>

    				<label htmlFor="psw"><b>Password</b></label>
    				<input type="password" placeholder="Enter Password" name="psw" required/>
        
    			<input type="button" value="Login" className="loginButton"/>
  			</div>
			</form>
      )
    
  }
}

export default Login
