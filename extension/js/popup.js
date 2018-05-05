function twiAuth() {
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
    console.log("test")
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(result)
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(error);
    });
  }
