import React, { Component } from "react";
import axios from 'axios';

import api_url from "../environment/environment";


export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {datas: []}
  }

  componentWillMount () {
    let list = [];
    axios.get(api_url.api_url+'?type=all').then((res) => {
      let data = res.data.data;
      data.sort(function(a,b){
        if(a.max_count > b.max_count) return -1;
        if(a.max_count < b.max_count) return 1;
        return 0;
      });
      for (var i in data) {
        list.push(<tr key={parseInt(i, 10)} ><th>{parseInt(i, 10)+1}</th><th>{data[i].max_count}</th><th>{data[i].username}</th></tr>);
      }
      this.setState({datas: list});
    });
  }

  render () {

    return (
      <div className="ranking_container">
      <table border="1">
      <tbody>
        <tr>
          <th>Rank</th>
          <th>Count</th>
          <th>UserName</th>
        </tr>
        {this.state.datas}
      </tbody>
      </table>
      </div>
    );
  }
}
