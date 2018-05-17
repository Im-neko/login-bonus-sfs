import React, { Component } from "react";
import { HashRouter, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';

import Ranking from "./components/Ranking";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Message from "./components/Message";



class Top extends Component {
render () {
    return (
      <HashRouter>
        <div>
          <AppBar
            title="SFC連続ログインランキング"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <center>
          <Message />
          <Route exact path="/" component={Ranking} />
          <Route exact path="/login" component={Login} />
          <Footer />
          </center>
        </div>
      </HashRouter>
    );
  }
}

export default Top;
