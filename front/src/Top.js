import React, { Component } from "react";
import { HashRouter, Route } from 'react-router-dom';

import Ranking from "./components/Ranking";
import Footer from "./components/Footer";
import Login from "./components/Login";



class Top extends Component {
render () {
    return (
      <HashRouter>
        <div>
          <center>
          <h1>SFC連続ログインランキング</h1>
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
