if (process.env.ENV === 'dev') {
  exports.ranking_url = 'http://localhost:5000/sfs-login-bonus/us-central1/rankingapi';
  exports.post_user_url = 'http://localhost:5000/sfs-login-bonus/us-central1/userapi';
}else{
  exports.ranking_url = 'https://us-central1-sfs-login-bonus.cloudfunctions.net/rankingapi';
  exports.post_user_url = 'https://us-central1-sfs-login-bonus.cloudfunctions.net/userapi';
}
