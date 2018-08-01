// Backgammon Clock and Score board App 用 JavaScript

  //広域変数
  var score = [0, 0, 0]; //スコアを初期設定。引数を1,2として使うため、配列要素は3つ用意
  var matchlength = 5;
  var crawford = 0; //0=before cf, 1=cf, 2=post cf
  var cfplayer = 0;
  var allotedtime = 600; //初期設定10分
  var timer = [0, allotedtime, allotedtime]; //引数を1,2として使うため、配列要素は3つ用意
  var delaytime = 12;
  var delay = delaytime;
  var turn = 0; //0=どちらでもない、1 or 2=どちらかがプレイ中
  var pauseflg = true; //pause状態で起動する
  var timeoutflg = false;
  var clock; //タイマ用変数
  var clockspd = 1000; //msec どこまでの精度で時計を計測するか
                       //1000の約数でないと時計の進みがいびつになり、使いにくい
                       //200msecだと残時間管理が精密になるがブラウザのCPU負荷が上がる
  var gamemodestr = "Match game to "+ matchlength;
  var hourhandflg = true;
  var soundflg = true;
  var vibrationflg = false; //バイブレーションの初期設定は無効
  var iosflg = is_iOS();
  if (iosflg) { $("#tr_vibration").css("display", "none"); } //iOSのときはバイブレーションの設定項目を表示しない

  var theme = "warm";
  var themecolor = set_themecolor(theme);

  var cv1 = {}, cv2 = {}, cv3 = {}; //canvasで使うための状態を保持するオブジェクト
  init_canvas();

//イベントハンドラの定義
$(function() {

  //設定画面の[APPLY] ボタンがクリックされたとき
  $("#applybtn").on('click', function(e) {
    set_initial_vars();
    $("#settingwindow").slideUp("normal");
    $("#settingbtn,#pausebtn,#score1up,#score1dn,#score2up,#score2dn").removeClass("btndisable"); //ボタンクリックを有効化
  });

  //設定画面の[CANCEL] ボタンがクリックされたとき
  $("#cancelbtn").on('click', function(e) {
    $("#settingwindow").slideUp("normal"); //設定画面を消す
    $("#settingbtn,#pausebtn,#score1up,#score1dn,#score2up,#score2dn").removeClass("btndisable"); //ボタンクリックを有効化
  });

  //メイン画面の[SETTING] ボタンがクリックされたとき
  $("#settingbtn").on('click', function(e) {
    if ($(this).hasClass("btndisable")) { return; } //disableのときは何もしない
    topleft = winposition( $("#settingwindow") );
    $("#settingwindow").css(topleft).slideDown("normal"); //画面表示
    $("#settingbtn,#pausebtn,#score1up,#score1dn,#score2up,#score2dn").addClass("btndisable"); //ボタンクリックを無効化
  });

  //メイン画面の[PAUSE] ボタンがクリックされたとき
  $("#pausebtn").on('click', function(e) {
    if (turn == 0) { return; } //どちらの手番でもない場合は何もしない
    if ($(this).hasClass("btndisable")) { return; } //disableのときは何もしない
    if (pauseflg) { //PAUSE -> PLAY
      pause_out();
      startTimer(turn); //現在の持ち時間からクロック再開
    } else { //PLAY -> PAUSE
      pause_in("PAUSE");
      stopTimer();
    }
    sound("pause"); vibration("pause");
  });

  //クロックの場所がクリック(タップ)されたとき
  $("#timer1cv,#timer2cv").on('touchstart mousedown', function(e) {
    e.preventDefault(); // touchstart以降のイベントを発生させない
    idname = $(this).attr("id");
    tappos = Number(idname.substr(5,1));
    tap_timerarea(tappos);
  });

  //スコア操作のボタンがクリックされたとき
  $("#score1up,#score1dn,#score2up,#score2dn").on('click', function(e) {
    idname = $(this).attr("id");
    if ($(this).hasClass("btndisable")) { return; } //disableのときは何もしない
    modify_score(idname);
  });

  //テーマが変更されたとき
  $("#theme").on('change', function(e) {
    theme = $("[name=theme]:checked").val();
    change_theme(theme);
  });

}); //close to $(function() {

//スコア操作ボタンによるスコア設定
function modify_score(idname) {
  player = Number(idname.substr(5,1));
  updn   = idname.substr(6,1);

  delta = updn=="u" ? +1 : updn=="d" ? -1 : 0; //押されたボタンを判断し、増減を決める
  score[player] += delta;
  if (score[player] < 0) { score[player] = 0; }

  //Crawfordかどうかを判断
  if (matchlength - score[player] == 1 && crawford == 0) {
    crawford = 1; cfplayer = player; cfstr = "Crawford";
  } else if (crawford == 2 || (crawford == 1 && cfplayer != player)) {
    crawford = 2; cfplayer = 0;      cfstr = "Post Crawford";
  } else {
    crawford = 0; cfplayer = 0;      cfstr = "";
  }

  //画面に反映
  $("#score"+player).text(score[player]);
  $("#gamemode").html(gamemodestr + "<br>" + cfstr);
}

//ポップアップ画面で設定した内容を反映
function set_initial_vars() {
  $("#player1").text( $("#playername1").val() );
  $("#player2").text( $("#playername2").val() );
  score = [0, 0, 0];
  $("#score1").text(score[1]);
  $("#score2").text(score[2]);
  matchlength = $("#matchlength").val();
  crawford = 0;
  if (matchlength == 0) { //unlimited
    gamemodestr = "Unlimited game";
  } else {
    gamemodestr = "Match game to "+ matchlength;
  }
  $("#gamemode").text(gamemodestr);

  delaytime = Number($("#delaytime").val());
  $("#delay1,#delay2").text(("00"+delaytime).substr(-2));
  allotedtime = Number($("#allotedtimemin").val()) * 60;
  timer = [0, allotedtime, allotedtime];
  disp_timer(1, timer[1]);
  disp_timer(2, timer[2]);
  turn = 0; //手番をリセット
  theme = $("[name=theme]:checked").val();
  change_theme(theme);
  soundflg = $("[name=sound]").prop("checked");
  vibrationflg = $("[name=vibration]").prop("checked");
  hourhandflg = $("[name=hourhand]").prop("checked");
  $("#pauseinfo").removeClass("lose");
  timeoutflg = false;
  pause_in("PAUSE"); //PAUSE状態にする
}

//PLAY -> PAUSE
function pause_in(txt) {
  pauseflg = true;
  $("#pauseinfo").text(txt).show();
  $("#settingbtn,#score1up,#score1dn,#score2up,#score2dn").removeClass("btndisable"); //ボタンクリックを有効化
  draw_timerframe(cv1,timer[1],"pause"); //クロックをPAUSE状態に
  draw_timerframe(cv2,timer[2],"pause");
}

//PAUSE -> PLAY
function pause_out() {
  pauseflg = false;
  $("#pauseinfo").hide();
  $("#settingbtn,#score1up,#score1dn,#score2up,#score2dn").addClass("btndisable"); //ボタンクリックを無効化
}

//クロックを表示
function disp_timer(turn, time) {
  cv = (turn==1 ? cv1 : cv2);
  draw_timerframe(cv,time,"teban");
}

//クロック表示場所をクリック(タップ)したときの処理
function tap_timerarea(tappos) {
  //クロック稼働中で相手側(グレーアウト側)をクリックしたときは何もしない
  //＝相手の手番、またはポーズのときは以下の処理を実行
  if (turn != tappos && pauseflg == false) { return; }
  if (timeoutflg) { return; } //切れ負け状態のときは何もしない

  if (pauseflg) { //ポーズ状態のときはポーズを解除
    pause_out();
  }
  turn = ( tappos==1 ? 2 : tappos==2 ? 1 : 0 ); //手番切替え
  sound("tap"); vibration("tap");

  stopTimer(); //自分方のクロックを止める

  delay = delaytime; //保障時間を設定
  draw_delayframe(cv3,delaytime,delay);

  startTimer(turn); //相手方のクロックをスタートさせる

  //クロックの稼働/停止を切替え
  switch (turn) {
    case 1:
      //右側を停止
      draw_timerframe(cv1,timer[1],"teban");
      draw_timerframe(cv2,timer[2],"noteban");
      break;
    case 2:
      //左側を停止
      draw_timerframe(cv1,timer[1],"noteban");
      draw_timerframe(cv2,timer[2],"teban");
      break;
    default:
      alert("wrong! turn="+turn+" tappos="+tappos);
      break;
  }
}

function startTimer(turn) {
  clock = setInterval(function(){countdown(turn);}, clockspd);
}

function stopTimer() {
  clearInterval(clock);
}

//クロックをカウントダウン
function countdown(turn) {
  if (delay > 0) {
    //保障時間内
    delay -= clockspd / 1000;
    if (delay < 0) { delay = 0; }
    draw_delayframe(cv3,delaytime,delay);
  } else {
    //保障時間切れ後
    timer[turn] -= clockspd / 1000;
    if (timer[turn] < 0) { timer[turn] = 0; }
    if (timer[turn] <= 0) { //切れ負け処理
      timeoutflg = true;
      timeup_lose(turn);
      return;
    }
    disp_timer(turn, timer[turn]);
  }
}

//切れ負け処理
function timeup_lose(turn) {
  $("#pauseinfo").addClass("lose");
  stopTimer();
  pause_in("TIME OUT"); //ポーズ状態に遷移
  sound("buzzer"); vibration("buzzer");
}

function change_theme(theme) {
  switch (theme) {
  case "warm":
    $("#themecss").attr("href", "css/theme_warm.css");
    themecolor = set_themecolor(theme);
    break;
  case "cool":
    $("#themecss").attr("href", "css/theme_cool.css");
    themecolor = set_themecolor(theme);
    break;
  case "mono":
    $("#themecss").attr("href", "css/theme_mono.css");
    themecolor = set_themecolor(theme);
    break;
  }
  //テーマに合わせてcanvasオブジェクトを再描画
  draw_timerframe(cv1,timer[1],"pause");
  draw_timerframe(cv2,timer[2],"pause");
  draw_delayframe(cv3,delaytime,delay);

}

//音を鳴らす
function sound(type) {
  if (soundflg) {
    document.getElementById(type).play(); //音の種類は引数で指定
  }
}

//バイブレーション
function vibration(type) {
  if (vibrationflg) {
    switch (type) {
    case "tap":
      navigator.vibrate( 50 );  break;
    case "pause":
      navigator.vibrate( [50, 50, 100] );  break;
    case "buzzer":
      navigator.vibrate( 1000 ); break;
    }
  }
}

//画面中央に表示するための左上座標を計算
function winposition(winobj) {
  wx = $(document).scrollLeft() + ($(window).width() - winobj.outerWidth()) / 2;
  if (wx < 0) { wx = 0; }
  wy = $(document).scrollTop() + ($(window).height() - winobj.outerHeight()) / 2;
  if (wy < 0) { wy = 0; }
  return {top:wy, left:wx};
}

//UserAgentを確認し、iOSか否かを判断する
function is_iOS() {
  ua = window.navigator.userAgent.toLowerCase();
  return (ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1 || ua.indexOf('ipad') !== -1);
}
function init_canvas() {
  cv1.canvas = document.getElementById("timer1cv");
  cv1.ctx = cv1.canvas.getContext('2d');
  cv2.canvas = document.getElementById("timer2cv");
  cv2.ctx = cv2.canvas.getContext('2d');
  cv3.canvas = document.getElementById("delaycv");
  cv3.ctx = cv3.canvas.getContext('2d');
  cv1.width  = $("#timer1").width();
  cv1.height = $("#timer1").height();
  cv2.width  = $("#timer2").width();
  cv2.height = $("#timer2").height();
  cv3.width  = $("#delay").width();
  cv3.height = $("#delay").height();

  //canvasオブジェクトを描画
  draw_timerframe(cv1,timer[1],"pause");
  draw_timerframe(cv2,timer[2],"pause");
  draw_delayframe(cv3,delaytime,delaytime);
}

//タイマーを表示
function draw_timerframe(cv,timer,stat){
  const ctx = cv.ctx;
  const s = (cv.width < cv.height) ? cv.width : cv.height; //小さいほう
  const w = cv.canvas.width = s;
  const h = cv.canvas.height = s;
  const r = s/2; //半径
  const center = {x : r, y : r}; //中心

  //背景
  switch(stat) {
    case "pause":
      ctx.fillStyle = themecolor.back_pause;
      break;
    case "teban":
      ctx.fillStyle = themecolor.back_teban;
      break;
    case "noteban":
      ctx.fillStyle = themecolor.back_noteban;
      break;
    default:
      ctx.fillStyle = themecolor.back_alert;
  }
  ctx.fillRect(0, 0, w, h);

  //外枠
  ctx.strokeStyle = themecolor.clock_border;
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, w-1, h-1);

  //描画開始位置を中心に移動
  ctx.translate(center.x, center.y);

  //分目盛
  ctx.save();
  ctx.strokeStyle = themecolor.dots_min;
  ctx.lineWidth = 2;
  ctx.beginPath();
    for (let i=0;i<60;i++){
      ctx.moveTo(r,0);
      ctx.lineTo(r-10,0);
      ctx.rotate(Math.PI/30);
    }
  ctx.stroke();

  //時目盛(5分毎)
  ctx.strokeStyle = themecolor.dots_hour;
  ctx.lineWidth = 3;
  ctx.beginPath();
    for (let i=0;i<12;i++){
      ctx.moveTo(r,0);
      ctx.lineTo(r-20,0);
      ctx.rotate(Math.PI/6);
    }
  ctx.stroke();
  ctx.restore();

  //針の設定
  //60ではなく、59.999にすることで、0秒、0分のとき0度になるようにする
  const sec = 59.999 - (timer % 60);
  const min = Math.floor(59.999 - (timer / 60));
  const hr = Math.floor(11.999 - (timer / 3600));

//console.log(hr, min, sec, timer);

  //時針(短針)
  if (hourhandflg) { //trueのとき表示、falseのとき非表示
    ctx.save();
    ctx.rotate((Math.PI/6)*hr + (Math.PI/360)*min + (Math.PI/21600)*sec);
    ctx.lineWidth = 8;
    ctx.strokeStyle = themecolor.hour_hand;
    ctx.beginPath();
    ctx.moveTo(-3,25);
    ctx.lineTo(0,-(r-70));
    ctx.lineTo(3,25);
    ctx.stroke();
    ctx.restore();
  } // if (hourhandflg)

  //分針(長針)
  ctx.save();
  ctx.rotate((Math.PI/30)*min + (Math.PI/1800)*sec);
  ctx.lineWidth = 4;
  ctx.strokeStyle = themecolor.min_hand;
  ctx.beginPath();
  ctx.moveTo(-2,25);
  ctx.lineTo(0,-(r-50));
  ctx.lineTo(2,25);
  ctx.stroke();
  ctx.restore();

  //秒針
  ctx.save();
  ctx.rotate(sec * Math.PI/30);
  ctx.strokeStyle = themecolor.sec_hand;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0,30);
  ctx.lineTo(0,-(r-20));
  ctx.stroke();
  ctx.restore();

  //時計の中心の丸
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = themecolor.center_stroke;
  ctx.fillStyle   = themecolor.center_fill;
  ctx.arc(0,0,7,0,Math.PI*2,true);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

//delayを表示
function draw_delayframe(cv, delaytime, remain){
  const ctx = cv.ctx;
  const w = cv.canvas.width = cv.width;
  const h = cv.canvas.height = cv.height;
  const r = (w>h ? h/2 : w/2); //半径は縦横の短いほうを選択

  ctx.clearRect(0, 0, w, h);

  //残delay時間
  const angle = 360 * ((delaytime - remain)/delaytime);

  //だんだん小さくなる円弧を描画
  ctx.beginPath();
  ctx.arc(w/2, h/2, r-1, (angle - 90) * Math.PI/180, (360 - 90) * Math.PI/180, false);
  ctx.lineTo( w/2, h/2);
  ctx.fillStyle = themecolor.delay_remain;
  ctx.fill();
  //だんだんおおきくなる円弧を描画
  ctx.beginPath();
  ctx.arc(w/2, h/2, r-1,(angle - 90) * Math.PI/180, (0 - 90) * Math.PI/180, true);
  ctx.lineTo( w/2, h/2);
  ctx.fillStyle = themecolor.delay_used;
  ctx.fill();

  //外周
  ctx.beginPath();
  ctx.arc(w/2, h/2, r-3, 0, Math.PI * 2, false); //外側divで削られないよう半径を調整
  ctx.strokeStyle = themecolor.delay_border;
  ctx.lineWidth = 5;
  ctx.stroke();
}
