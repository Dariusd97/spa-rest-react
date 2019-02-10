import React, { Component } from 'react';
import { Route, NavLink, HashRouter,Switch} from 'react-router-dom';
import FavoritesList from './FavoritesList'
import DeviationHotList from './DeviationHotList'
import DeviationPopularList from './DeviationPopularList'
import DeviationNewestList from './DeviationNewestList'
import DeviationDailyList from './DeviationDailyList'
import Login from './Login'


class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h2>Manager de artisti favoriti</h2>
          <ol className="menuBar">
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/home" >Home</NavLink></li>
              <li><NavLink to="/hotDeviations" >Hot deviations</NavLink></li>
              <li><NavLink to="/popularDeviations" >Popular deviations</NavLink></li>
              <li><NavLink to="/newestDeviations" >Newest deviations</NavLink></li> 
              <li><NavLink to="/favorites">Favorites</NavLink></li>
          </ol>
          <div className="content">
          <Switch>
          <Route exact path="/login" component={Login}/>
            <Route path="/home" component={DeviationDailyList}/>
            <Route path="/hotDeviations" component={DeviationHotList}/>
            <Route path="/popularDeviations" component={DeviationPopularList}/>
            <Route path="/newestDeviations" component={DeviationNewestList} />
            <Route path="/favorites" component={FavoritesList}/>
          </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
