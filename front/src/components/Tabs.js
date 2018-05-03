import React, { Component } from "react";
import Ranking from "./Ranking";


export default class extends Component {
  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className="Tabs">
        <Ranking />
      </div>
    );
  }
}
