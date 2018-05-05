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

post_count = async () => {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
      if (this.readyState==4 && this.status==200) {
          // responseをhogehogeする
      }
  };
  xhr.responseType = 'json';
  xhr.open('GET',endpoint,true);
  xhr.send();
}

message = async () => {
  alert("現在連続ログイン日目です！");
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

scripts = () => {
  var script1 = document.createElement('script');
  script1.src = 'https://www.gstatic.com/firebasejs/4.13.0/firebase.js';
  document.body.appendChild(script1);
  var script2 = document.createElement('script');
  script2.src = 'https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.js';
  document.body.appendChild(script2);
  var script3 = document.createElement('link');
  script3.type="text/css";
  script3.rel="stylesheet";
  script3.href="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css";
  document.body.appendChild(script3);
  var script4 = document.createElement('script');
  script4.src = 'https://im-neko.net/sfc/popup.js';
  document.body.appendChild(script4);
}

join_rank = () => {
  let html = document.getElementById('navigation').innerHTML;
  html = '\
  <div class="rnavi01"> \
  <a href="" onClick="twiAuth()"> 連続ログインランキング戦に参加する </a>\
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
  scripts();
  join_rank();
  let info = getByXpath('/html/body/table[1]/tbody/tr/td[2]/text()');
  const schoolId = info.data.split(' ')[3];

  hash = await chrome.storage.local.get(['hash'], async (r) => {
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

  console.log('hash', hash);

  let date = new Date();
  date = date.getTime();

  let data = {}

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

    data = await check_login(data, date);

    await chrome.storage.local.set({data: data}, async (e) => {
      if (!e) {
        if (!todaylogin) {
          await popup(data);
        }
        // debug用
        // clearStorage();
        // console.log("clear")
      } else {
        console.error(date);
      }
    });
  });
}

let todaylogin = false;
main();
