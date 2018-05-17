import React, { Component } from "react";
import axios from 'axios';

import * as apis from "../environment/environment";
import Loader from "./Loader";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {datas: [], loader: true}
  }

  componentWillMount () {
    let list = [];
    axios.get(apis.ranking_url+'?type=all').then((res) => {
      let data = res.data.data;
      data = data.map((data) => {
        let num = parseInt(data.last_login, 10);
        data.last_login = new Date(num)+'';
        return data;
      })
      console.log(data)
      data.sort(function(a,b){
        if(a.max_count > b.max_count) return -1;
        if(a.max_count < b.max_count) return 1;
        return 0;
      });
      for (var i in data) {
        list.push(<tr key={parseInt(i, 10)} ><th>{parseInt(i, 10)+1}</th><th>{data[i].max_count}</th><th>{data[i].username}</th><th>{data[i].last_login}</th></tr>);
      }
      this.setState({datas: list});
      this.setState({loader: false});
    });
  }

  render () {

    return (
      <div className="ranking_container">
      <Loader isActive={this.state.loader}/>
      <table border="1">
      <tbody>
        <tr>
          <th>Rank</th>
          <th>Count</th>
          <th>UserName</th>
          <th>LastLoginTime</th>
        </tr>
        {this.state.datas}
      </tbody>
      </table>
      </div>
    );
  }
}
