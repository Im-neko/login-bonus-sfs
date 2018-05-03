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

message = async (data) => {
  alert("現在連続ログイン"+data.now_count+"日目です！");
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

main = async () => {
  let date = new Date();
  date = date.getTime();

  let data = {}

  data = await chrome.storage.local.get(['data'], async (r) => {
    if (r.data) {
      data = r.data;
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
        //clearStorage();
        console.log("clear")
      } else {
        console.error(date);
      }
    });
  });
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
  </div> \
';
  document.getElementById("copyright").innerHTML = html;
}

let todaylogin = false;
main();
