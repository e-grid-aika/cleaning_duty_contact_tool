/**
 * 掃除スケジュールの自動作成テスト
 * 金曜日の18:00~18:30に掃除の予定を一ヶ月分作成できることを確認
 */
function TestCreateSchedule(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("TestCalendar_id");
  const sheet_id = PropertiesService.getScriptProperties().getProperty("Sheet_id");
  
  //開始と終了用二つのカレンダーオブジェクトを作成する必要がある
  const start_date = new Calendar(calendar_id);
  const end_date = new Calendar(calendar_id);
  
  //1カ月の内,金曜日の日付を取得する
  var cleaning_start_dates = start_date.getWeekDay('Friday');
  var cleaning_end_dates = end_date.getWeekDay('Friday');

  //スプレッドシートから米子オフィスメンバーの名前を取得
  const member_list = new Member();
  
  var title = [];
  
  cleaning_start_dates.forEach((element) => element.setHours(18,00,00));
  cleaning_end_dates.forEach((element) => element.setHours(18,30,00));

  //メンバーを２人１組のペアにする処理
  pair_list = member_list.createPair();

  //カレンダーに掃除の予定を追加 
  for(let i=0; i<cleaning_start_dates.length; i++){
    title[i] = `【${pair_list[i][0]}・${pair_list[i][1]}】掃除`;
    start_date.calendar_app.createEvent(title[i],cleaning_start_dates[i],cleaning_end_dates[i]);
  }
}
/**
 * Chatworkbot_テスト
 * 
 * ChatworkAPIを使って、テスト用のルームにメッセージを送れるか確認
 * カレンダーにダミーの予定追加　予定のタイトルを「【人名１・人名２】～～～～」とする
 */
function TestCleaningDutyBot(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("TestCalendar_id");
  const calendar_obj = new Calendar(calendar_id);
  
  var date = new Date();
  const events = calendar_obj.calendar_app.getEventsForDay(date);
  
  const token = PropertiesService.getScriptProperties().getProperty("TestChatwork_API_Token");
  const room_id = PropertiesService.getScriptProperties().getProperty("TestChatwork_room_id");
  
  var user_list = [];
  
  chatwork = new Chatwork(token,room_id);
  
  const myRe = /】掃除$/;
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    //正規表現でイベントのタイトルに「】掃除」を含むか判定
    if(myRe.exec(event.getTitle())){
      tmp = event.getTitle().split(/[【・】]/);
      user_list.push(tmp[1]);
      user_list.push(tmp[2]);
    }
  }

  //Chatwork APIでメッセージを送信
  if(user_list?.[0]){
    let message =  `[info][title]掃除当番の連絡です[/title]今週の掃除当番は\
    ${user_list[0]}さん・${user_list[1]}さんです。\n定時後にオフィスの清掃をお願いします。[/info]`;
    chatwork.sendMessage(message);
  }else{
    console.log('カレンダーイベントの読み込みに失敗しました。');
  }
}

/**
 * Calendarクラス_テスト
 * getWeekDay():曜日ごとの日付を取得する
 * */
function TestCalendar(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("TestCalendar_id");
  const test_calendar = new Calendar(calendar_id);

  console.log(test_calendar.getWeekDay('Sunday')); //日曜日の日付
  console.log(test_calendar.getWeekDay('Monday',true)); //月曜日の日付(祝日は除く)
  console.log(test_calendar.getWeekDay('Monday',false)); //月曜日の日付(祝日も含める)
  console.log(test_calendar.getWeekDay('Tuesday')); //火曜日の日付
  console.log(test_calendar.getWeekDay('Wednesday')); //水曜日の日付
  console.log(test_calendar.getWeekDay('Thursday')); //木曜日の日付
  console.log(test_calendar.getWeekDay('Friday')); //金曜日の日付
  console.log(test_calendar.getWeekDay('Saturday')); //土曜日の日付
  console.log(test_calendar.getWeekDay('Manday')); //エラー
}

/**
 * Memberクラス_テスト
 * getShuffleMember():member_listの中身をランダムに並び替える
 * reatePair()：member_listから2人1組のペアを作成する
 * */
function TestMember(){
  const member_list = new Member();
  shuffle_list = member_list.getShuffleMember();
  pair_list = member_list.createPair();

  console.log(member_list);
  console.log(shuffle_list);
  console.log(pair_list);
}


function test(){
  const myRe = /】掃除$/;
  const myArray = myRe.exec("【A・B掃除"); 

  if(myArray){
    console.log('あったよ');
  }else{
    console.log('ないよ');
  }
}
