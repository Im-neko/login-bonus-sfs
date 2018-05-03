let api_url = ''

if (process.env.NODE_ENV === 'development') {
  console.log('devlope');
  console.log(process.env.NODE_ENV)
  exports.api_url = 'http://localhost:5000/sfs-login-bonus/us-central1/rankingapi'
}else{
  console.log('production');
  console.log(process.env.NODE_ENV)
  exports.api_url = 'https://us-central1-sfs-login-bonus.cloudfunctions.net/rankingapi'
}
