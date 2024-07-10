
/**
 * createCleaningSchedule
 * 毎月の掃除予定をカレンダーに作成する関数
 * 
 */
function createCleaningSchedule(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  const sheet_id = PropertiesService.getScriptProperties().getProperty("Sheet_id");
  
  //開始と終了用二つのカレンダーオブジェクトを作成する必要がある
  const schedule_start = new Calendar(calendar_id);
  const schedule_end = new Calendar(calendar_id);
  
  //1カ月の内,金曜日の日付を取得する
  var cleaning_start_dates = schedule_start.getFriday();
  var cleaning_end_dates = schedule_end.getFriday();

  //スプレッドシートから米子オフィスメンバーの名前を取得
  let ss = SpreadsheetApp.openById(sheet_id);
  var sheet = ss.getSheetByName("読込シート");
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  const array = sheet.getRange(4,1,lastRow-3).getValues();
  const member_list = new Member(array.flat());
  
  var title = [];
  
  cleaning_start_dates.forEach((element) => element.setHours(18,00,00));
  cleaning_end_dates.forEach((element) => element.setHours(18,30,00));

  //メンバーを２人１組のペアにする処理
  pair_list = member_list.createPair();

  //カレンダーに掃除の予定を追加 
  for(let i=0; i<cleaning_start_dates.length; i++){
    title[i] = `【${pair_list[i][0]}・${pair_list[i][1]}】掃除`;
    schedule_start.createSchedule(title[i],cleaning_start_dates[i],cleaning_end_dates[i]);
  }
}
/**
 * cleaningDutyBot
 * Chatworkを使って掃除当番を通知する処理
 * 
 */
function cleaningDutyBot(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  const calendar_obj = new Calendar(calendar_id);
  const events = calendar_obj.getTodayEvents();
  var user_list = [];
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    if(regException(event.getTitle())){
      tmp = event.getTitle().split(/[【・】]/);
      user_list.push(tmp[1]);
      user_list.push(tmp[2]);
    }
  }

  if(user_list?.[0]){
    let message =  `[info][title]掃除当番の連絡です[/title]今週の掃除当番は\
    ${user_list[0]}さん・${user_list[1]}さんです。\n定時後にオフィスの清掃をお願いします。[/info]`;
  
    const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
    const room_id = PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");
    chatwork = new Chatwork(token,room_id);
    chatwork.sendMessage(message);
  }else{
    console.log('カレンダーイベントの読み込みに失敗しました。');
  }
}

function regException(received_text){
  text = received_text;
  switch(true){
    case /】掃除$/.test(text):
      return true;
    default:
      return false;
  }
}
