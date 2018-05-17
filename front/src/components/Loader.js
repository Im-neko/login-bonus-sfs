import React, { Component } from "react";
import CircularProgress from 'material-ui/CircularProgress';

export default class extends Component {
  render () {
      if(this.props.isActive){
        return (
          <div>
            <CircularProgress size={80}/>
          </div>
        );
      } else{
          return null;
      }
  }
}
