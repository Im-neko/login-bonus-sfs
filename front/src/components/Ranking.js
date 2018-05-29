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
        let last_date = new Date(num);
        data.last_login = last_date.getFullYear()+'/'
                            +(('00'+(last_date.getMonth()+1)).slice(-2))+'/'
                            +('00'+last_date.getDate()).slice(-2)+' '
                            +('00'+last_date.getHours()).slice(-2)+':'
                            +('00'+last_date.getMinutes()).slice(-2);
        return data;
      })
      console.log(data)
      data.sort(function(a,b){
        return b.max_count - a.max_count;
      });
      for (var i in data) {
        list.push(<tr key={parseInt(i, 10)} ><th>{parseInt(i, 10)+1}</th><th>{data[i].max_count}</th><th>{data[i].username}</th><th>{data[i].last_login}</th></tr>);
      }
      this.setState({datas: list});
      this.setState({loader: false});
    });
  }

  render () {
    if (this.state.loader){
      return (
        <div className="ranking_container">
          <Loader isActive={this.state.loader}/>
        </div>
      );
    } else {
      return (
        <div className="ranking_container">
        <table border="1">
        <tbody>
          <tr>
            <th>Rank</th>
            <th>Count</th>
            <th>UserName</th>
            <th>LastLogin</th>
          </tr>
          {this.state.datas}
        </tbody>
        </table>
        </div>
      );
    }
  }
}
