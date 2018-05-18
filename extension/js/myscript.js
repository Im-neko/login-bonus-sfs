getday0000 = (date) => {
  date = new Date(date);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date = date.getTime();
  return date;
}

sha256 = (text) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '', false);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send( 'text='+text );
    if(xhr.status == 200) {
      let res = JSON.parse(xhr.response);
      let hash = res.data;
      debug?console.log('sha256 hash: ', hash):null
       chrome.storage.local.set({hash: hash},  (e) => {
        e? reject("setting error") : resolve(hash);
      });
    }else{
      reject("not found");
    }
  });
}


clearStorage = () => {
  return chrome.storage.local.clear(function (r) {
    debug?console.log("clear storage"):null
  })
}

check_login = (data, date) => {
  return new Promise((resolve, reject) => {
    let lastLoginDay = getday0000(data.last_login);
    let gap = date - lastLoginDay;
    // 二回目以降のログイン
    if (gap < 24*60*60*1000) {
      todaylogin = true;
      if (date === data.last_login) {todaylogin = false;}
      data.last_login = date;
      debug?console.log('already yet'):null
      resolve(data);
    // 2日以上あいた場合
    } else if (gap > 2*24*60*60*1000) {
      data.now_count = 1;
      data.last_login = date;
      debug?console.log('reset count'):null
      resolve(data);
    // 連続ログイン
    } else if (gap > 24*60*60*1000){
      data.now_count += 1;
      data.last_login = date;
      if (data.now_count > data.max_count) {
        data.max_count += 1;
      }
      debug?console.log('increment count'):null
      resolve(data);
    }else{
      debug?console.error("date",date):null
      debug?console.error("data",data):null
    }
  });
}

put_count = (hash, max_count, now_count, last_login) => {
  return new Promise((resolve, reject) => {
    console.log(hash,max_count,now_count,last_login)
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://us-central1-sfs-login-bonus.cloudfunctions.net/userapi', false);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send( 'schoolId='+hash+'&max_count='+max_count+'&now_count='+now_count+'&last_login='+last_login );
    if (xhr.status == 200){
      let res = JSON.parse(xhr.response);
      resolve(res);
    } else {
      reject("failed to put");
    }
  });
}

get_status = (hash) => {
  return new Promise((resolve, reject) => {
    if(hash !== 'undefined'){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://us-central1-sfs-login-bonus.cloudfunctions.net/userapi?schoolId='+hash, false);  // `false` makes the request synchronous
      xhr.send(null);
      if(xhr.status == 200) {
        let res = JSON.parse(xhr.response);
        debug?console.log('get status: ', res):null
        chrome.storage.local.set({status: true}, (e) => {
          e? reject(e): resolve(hash);
        });
      }
    } else {
      reject(false);
    }
  });
}

get_hash = (schoolId) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['hash'],  async (r) => {
      if (r.hash) {
        debug?console.log('hash exist'):null
        resolve(r.hash);
      }else{
        debug?console.log("hash doesn't exist"):null
        try{
          hash = await sha256(schoolId);
        } catch (e) {
          console.log(e);
        }
        resolve(hash);
      }
    });
  });
}

get_local_data = (date) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['data'],  (r) => {
      if (r.data) {
        resolve(r.data);
      }else{
        data = {
          max_count: 1,
          now_count: 1,
          last_login: date,
        }
        resolve(data);
      }
    });
  });
}

get_local_status = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['status'],  (r) => {
      debug?console.log('local status: ', r):null
      if(r.status){
        resolve(true);
      }else{
        resolve(false);
      }
    });
  });
}

set_local_data = (data) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({data: data},  (e) => {
      if (!e) {
        if (!todaylogin) {
          popup(data)
          resolve(data);
        }
        // debug用
        //clearStorage():null
        resolve(data);
      } else {
        debug?console.error(date):null
        reject(data)
      }
    });
  });
}

getByXpath = (path) => {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

join_rank = (hash, max_count, now_count, last_login) => {
  let html = document.getElementById('navigation').innerHTML;
  html = '\
  <div class="navi01"> \
  <a href="https://sfc.login-ranking.work/#/login?hash='+hash+'&max_count='+max_count+'&now_count='+now_count+'&last_login='+last_login+'" target="_blank"> 連続ログインランキング戦に参加する</a>\
  </div> \
  <br> \
  ' + html;
  document.getElementById('navigation').innerHTML = html;
}

popup = (data) => {
  let now_count = data.now_count;
  let max_count = data.max_count;
  let html = document.getElementById("copyright").innerHTML;
  html = html + '<!-- ここからモーダルウィンドウ --> \
  <div id="modal-content"> \
  	<!-- モーダルウィンドウのコンテンツ開始 --> \
  	<p>モーダルウィンドウのコンテンツをHTMLで自由に編集することができます。画像や、動画埋め込みなど、お好きなものを入れて下さい。</p> \
  	<p>「閉じる」か「背景」をクリックするとモーダルウィンドウを終了します。</p> \
  	<p><a id="modal-close" class="button-link">閉じる</a></p> \
  	<!-- モーダルウィンドウのコンテンツ終了 --> \
  </div> \
  <p><a id="modal-open" class="button-link">クリックするとモーダルウィンドウを開きます。</a></p>;/'
  document.getElementById("copyright").innerHTML = html;
}

main = async () => {
  let data = {max_count: 0, now_count: 0, last_login: 0}
  let info = getByXpath('/html/body/table[1]/tbody/tr/td[2]/text()');
  const schoolId = info.data.split(' ')[3];

  let hash = await get_hash(schoolId);
  debug?console.log('returned hash', hash):null

  let date = new Date();
  date = date.getTime();

  data = await get_local_data(date);
  debug?console.log('get_local_data: ', data):null

  data = await check_login(data, date);
  debug?console.log('check_login: ', data):null

  join_rank(hash, data.max_count, data.now_count, data.last_login);

  let status = await get_local_status();
  let put_res = null;
  if (status) {
    put_res = await put_count(hash, data.max_count, data.now_count, data.last_login);
    debug?console.log('put_count res: ', put_res):null
  } else {
    put_res = await get_status(hash);
  }
  debug?console.log('put_res: ', put_res):null

  set_local_data(data);

}

const debug = false;
const version = '1.1.4';
let todaylogin = false;
main();
