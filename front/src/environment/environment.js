if (process.env.NODE_ENV === 'development') {
  exports.api_url = 'http://localhost:5000/sfs-login-bonus/us-central1/rankingapi'
}else{
  exports.api_url = 'https://us-central1-sfs-login-bonus.cloudfunctions.net/rankingapi'
}
