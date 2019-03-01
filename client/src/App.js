import React, { Component } from 'react';
import Rules from './Rules';
import Header from './Header';
import MainPage from './MainPage';
import PrivateRoute from './PrivateRoute';
import { Route } from 'react-router-dom';
import server from './Axios';

if (localStorage.getItem('x-auth-token')) {
  server.defaults.headers["x-auth"] = localStorage.getItem('x-auth');
}

class App extends Component {
  render() {
    return (
      <div className="d-flex flex-column h-100">
        <Header />

        <PrivateRoute exact path="/test" component={MainPage} />
        <Route exact path="/" component={Rules} />
      </div>
    );
  }
}

export default App;
