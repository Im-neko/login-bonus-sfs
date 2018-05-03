import React, { Component } from "react";

import Tabs from "./components/Tabs";
import Footer from "./components/Footer";



class Top extends Component {
render () {
    return (
      <div>
        <center>
        <h1>SFC連続ログインランキング</h1>
        <Tabs />
        <Footer />
        </center>
      </div>
    );
  }
}

export default Top;
