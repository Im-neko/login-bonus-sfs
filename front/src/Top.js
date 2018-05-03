import React, { Component } from "react";

import Tabs from "./components/Tabs";
import Footer from "./components/Footer";



export default class Top extends Component {
  constructor (props) {
    super(props);
  }

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
