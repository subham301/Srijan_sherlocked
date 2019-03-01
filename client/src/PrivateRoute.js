import React from 'react';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.Component {
  render() {
    if (!localStorage.getItem('x-auth')) return <Redirect to="/" />;
    return (
      <Route {...this.props} />
    );
  }
}

export default PrivateRoute;