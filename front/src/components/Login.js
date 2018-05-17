import React, { Component } from "react";
import axios from 'axios';
import * as firebase from "firebase";
import * as qs from "qs"
import Button from '@material-ui/core/Button';

import * as apis from "../environment/environment";


const style = {
  margin: 12,
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {query: ''}
  }

  componentWillMount () {
    let query = qs.parse(this.props.location.search.substr(1));
    this.setState({query: query});
  }

  async sendAuthData () {
    const url = apis.post_user_url;
    let data = {
      schoolId: this.state.query.hash,
      idToken: this.state.idToken,
      username: this.state.user_name || '名無し',
      max_count: this.state.query.max_count || 0,
      now_count: this.state.query.now_count || 0,
      last_login: this.state.query.last_login || 0
    }
    axios.post(url, data, {'Content-Type': 'application/json'})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  twitterAuth () {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCAeuBDDf8hcozgPwhdNz8wmfuLm6WmXLQ",
      authDomain: "sfs-login-bonus.firebaseapp.com",
      databaseURL: "https://sfs-login-bonus.firebaseio.com",
      projectId: "sfs-login-bonus",
      storageBucket: "sfs-login-bonus.appspot.com",
      messagingSenderId: "506080277314"
    };
    firebase.initializeApp(config);
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      this.setState({
        idToken: result.user.uid,
        user_name: result.additionalUserInfo.profile.name,
        icon_url: result.additionalUserInfo.profile.profile_image_url_https
      });
    }).then(async () => {
      await this.sendAuthData();
      this.setState({login: true})
    }).catch((error) => {
      console.log(error);
    });
  }

  render () {
    return (
      <div className="login_container">
        SFC-SFSのボタンからこのページに来ないとデータが反映されません．<br />
        <Button
          style={style}
          variant="raised"
          color="primary"
          onClick={this.twitterAuth.bind(this)}>
            twitterで認証する
        </Button>
        <br />

        {(() => {
            if (this.state.login) {
              return <p><img alt='twitter icon' src={this.state.icon_url} /><br/>{this.state.user_name}での登録が完了しました</p>
            }
          })()}

      </div>
    );
  }
}
