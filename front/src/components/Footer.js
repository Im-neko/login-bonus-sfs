import React, { Component } from "react";

const style = {
  position: "fixed",
  bottom: "0",
  width: "100%",
  height: "15%"
};


export default class extends Component {
  render () {
    return (
      <div id="footer" style={style}>
        <div className="siimple-footer siimple-footer--teal siimple-footer--fluid" align="center"> <br />
          Copyright © 2018 Im-neko.net All Rights Reserved.<br /><br />
          Powered by neko
        </div>
      </div>
    );
  }
}
