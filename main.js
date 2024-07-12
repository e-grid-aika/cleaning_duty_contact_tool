/**
 * createCleaningSchedule
 * 毎月の掃除予定をカレンダーに作成する関数
 * 
 */
function createCleaningSchedule(){
  //スクリプトプロパティに設定しているカレンダーID,スプレッドシートIDを取得
  const calendar_id = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  
  //開始と終了用二つのカレンダーオブジェクトを作成
  const start_date = new Calendar(calendar_id);
  const end_date = new Calendar(calendar_id);
  
  //1カ月の内,金曜日の日付を取得する
  var cleaning_start_dates = start_date.getWeekDay('Friday');
  var cleaning_end_dates = end_date.getWeekDay('Friday');

  //掃除の開始・終了時間(時間と分)をスクリプトプロパティから取得
  const CleaningStartHour = PropertiesService.getScriptProperties().getProperty("CleaningStartHour");
  const CleaningStartMinute = PropertiesService.getScriptProperties().getProperty("CleaningStartMinute");
  const CleaningEndHour = PropertiesService.getScriptProperties().getProperty("CleaningEndHour");
  const CleaningEndMinute = PropertiesService.getScriptProperties().getProperty("CleaningEndMinute");
 
  //スプレッドシートから米子オフィスメンバーの名前を取得
  const sheet_id = PropertiesService.getScriptProperties().getProperty("Sheet_id");
  let ss = SpreadsheetApp.openById(sheet_id);
  var sheet = ss.getSheetByName("読込シート");
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  const array = sheet.getRange(4,1,lastRow-3).getValues();
  const member_list = new Member(array);
  
  var title = [];

  cleaning_start_dates.forEach((element) => element.setHours(CleaningStartHour,CleaningStartMinute));
  cleaning_end_dates.forEach((element) => element.setHours(CleaningEndHour,CleaningEndMinute));

  //メンバーを２人１組のペアにする処理
  pair_list = member_list.createPair();

  //カレンダーに掃除の予定を追加 
  for(let i=0; i<cleaning_start_dates.length; i++){
    title[i] = `【${pair_list[i][0]}・${pair_list[i][1]}】掃除`;
    start_date.calendar_app.createEvent(title[i],cleaning_start_dates[i],cleaning_end_dates[i]);
  }
}
/**
 * cleaningDutyBot
 * Chatworkから掃除当番を知らせるメッセージを送る関数
 * 
 */
function cleaningDutyBot(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  const calendar_obj = new Calendar(calendar_id);
  var date = new Date();
  const events = calendar_obj.calendar_app.getEventsForDay(date);
  
  const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
  const room_id = PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");
  chatwork = new Chatwork(token,room_id);

  var user_list = [];

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
  
  if(user_list?.[0]){
    let message =  `[info][title]掃除当番の連絡です[/title]今週の掃除当番は\
    ${user_list[0]}さん・${user_list[1]}さんです。\n定時後にオフィスの清掃をお願いします。[/info]`;
  
    chatwork.sendMessage(message);
  }else{
    console.log('カレンダーイベントの読み込みに失敗しました。');
  }
}

