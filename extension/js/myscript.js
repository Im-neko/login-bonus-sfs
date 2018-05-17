getday0000 = async (date) => {
  date = new Date(date);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date = date.getTime();
  return date;
}

clearStorage = async () => {
  return await chrome.storage.local.clear(function (r) {
    console.log("clear storage", r);
  })
}

check_login = async (data, date) => {
  let lastLoginDay = await getday0000(data.last_login);
  let gap = date - lastLoginDay;
  // 二回目以降のログイン
  if (gap < 24*60*60*1000) {
    todaylogin = true;
    if (date === data.last_login) {todaylogin = false;}
    data.last_login = date;
    return data;
  // 2日以上あいた場合
  } else if (gap > 2*24*60*60*1000) {
    data.now_count = 1;
    data.last_login = date;
    return data;
  // 連続ログイン
  } else if (gap > 24*60*60*1000){
    data.now_count += 1;
    data.last_login = date;
    if (data.now_count > data.max_count) {
      data.max_count += 1;
    }
    return data;
  }else{
    console.error("date",date);
    console.error("data",data);
  }
}

post_count = async (max_count, now_count, last_login) => {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('PUT', 'https://us-central1-sfs-login-bonus.cloudfunctions.net/userapi');
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  xhr.send('max_count'+max_count+'now_count='+now_count+'last_login='+last_login);
  xhr.onreadystatechange = async function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let res = xhr.response;
      console.log(res);
    }
  }
}

get_status = async (hash) => {
  console.log(hash)
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  await xhr.open('GET', 'https://us-central1-sfs-login-bonus.cloudfunctions.net/userapi?schoolId='+hash);
  await xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let res = xhr.response;
      console.log(res);
      if(res.data){
        console.log(true)
        return true;
      }else{
        console.log(false)
        return false;
      }
    }
  }
}

sha256 = async (text) => {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('POST', 'https://us-central1-sfs-login-bonus.cloudfunctions.net/sha256api');
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  xhr.send( 'text='+text )
  xhr.onreadystatechange = async function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let res = xhr.response;
      let hash = res.data;
      await chrome.storage.local.set({hash: hash}, async (e) => {
        if (!e) {
          return hash;
        } else {
          return -1
        }
      });
    }
  }
}

hide = (array) => {
    array.forEach(function (id) {
        document.getElementById(id).style.display = 'none';
    })
}

show = (array) => {
    array.forEach(function (id) {
        document.getElementById(id).style.display = 'block';
    })
}

getByXpath = (path) => {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

join_rank = (hash, max_count, now_count, last_login) => {
  let html = document.getElementById('navigation').innerHTML;
  html = '\
  <div class="navi01"> \
  <a href="https://sfc.login-ranking.work/#/login?hash='+hash+'&max_count='+max_count+'&now_count='+now_count+'&last_login='+last_login+'" target="_blank"> 連続ログインランキング戦に参加する </a>\
  </div> \
  <br> \
  ' + html;
  document.getElementById('navigation').innerHTML = html;
}

popup = (data) => {
  let now_count = data.now_count;
  let max_count = data.max_count;
  let html = document.getElementById("copyright").innerHTML;
  console.log(typeof(html), html);
  html = html + '<div class="popupModal1"> \
   <input type="radio" name="modalPop" id="pop11" checked/> \
   <label for="pop11"></label> \
   <input type="radio" name="modalPop" id="pop12" /> \
   <label for="pop12">CLOSE</label> \
   <input type="radio" name="modalPop" id="pop13" /> \
   <label for="pop13">×</label> \
   <div class="modalPopup2"> \
    <div class="modalPopup3"> \
     <div class="modalMain"> \
     <h2 class="modalTitle">ログインボーナス！</h2>\
      <p>連続ログイン '+ now_count +' 日目！</p> \
      <p>最高連続ログイン '+ max_count +' 日!</p>\

     </div> \
    </div> \
   </div> \
  </div>';
  document.getElementById("copyright").innerHTML = html;
}

main = async () => {
  let data = {max_count: 0, now_count: 0, last_login: 0}
  let info = getByXpath('/html/body/table[1]/tbody/tr/td[2]/text()');
  const schoolId = info.data.split(' ')[3];

  let hash = await chrome.storage.local.get(['hash'], async (r) => {
    if (r.hash) {
      console.log('hash exist', r.hash);
      hash = r.hash;
      return r.hash;
    }else{
      console.log("hash doesn't exist");
      return await sha256(schoolId);
    }
  });
  /*
  * なんでか知らんが同期処理になってくれなくてキレそう
  * ほんまjavascript嫌い
  */

  let date = new Date();
  date = date.getTime();

  data = await chrome.storage.local.get(['data'], async (r) => {
    if (r.data) {
      data = r.data;
    }else{
      data = {
        max_count: 1,
        now_count: 1,
        last_login: date,
      }
      data = data;
    }

    data = await check_login(data, date)
    join_rank(hash, data.max_count, data.now_count, data.last_login);
    let status_flag = await get_status(hash);
    if (status_flag) {
      post_count(hash)
    }

    await chrome.storage.local.set({data: data}, async (e) => {
      if (!e) {
        if (!todaylogin) {
          await popup(data);
        }
        // debug用
        //clearStorage();
        //console.log("clear")
      } else {
        console.error(date);
      }
    });
  });
}

let todaylogin = false;
main();
