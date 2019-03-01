import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className="bg-light header">
        <img
          alt="logo"
          src={require('./images/s.png')}
          width="60px"
          style={{ padding: "10px" }}
        />
        <b style={{margin: "auto"}}>Sherlocked Finals</b>
      </div>
    );
  }
};

export default Header;