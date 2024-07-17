/**
 * createCleaningSchedule
 * 毎月の掃除予定をカレンダーに作成する関数
 * 
 */
function createCleaningSchedule(){
  //スクリプトプロパティに設定しているカレンダーID,スプレッドシートIDを取得
  const calendar_id = PropertiesService.getUserProperties().getProperty("Calendar_id");
  
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
  const sheet_id = PropertiesService.getUserProperties().getProperty("Sheet_id");
  let ss = SpreadsheetApp.openById(sheet_id);
  var sheet = ss.getSheetByName("読込シート");
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  const array = sheet.getRange(4,1,lastRow-3).getValues();
  const member_list = new Member(array);
  
  var title = [];
  var group_cnt=0;

  cleaning_start_dates.forEach((element) => element.setHours(CleaningStartHour,CleaningStartMinute));
  cleaning_end_dates.forEach((element) => element.setHours(CleaningEndHour,CleaningEndMinute));

  //掃除当番のグループを作成
  group_list = member_list.createGroup();

  //グループの数が掃除予定日より少ない場合、足りないグループを補填
  while(group_list.length < cleaning_start_dates.length){
    group_list.push(group_list[group_cnt]);
    group_cnt++;
  }

  //カレンダーに掃除の予定を追加 
  try{
    if(!group_list?.[0]) throw new Error('掃除当番のデータが存在しません')
    for(let i=0; i<cleaning_start_dates.length; i++){
      var tmp = '';
      for(let s=0; s < group_list[i].length; s++){
        if(s == 0){
          tmp += `${group_list[i][s]}`;
        }else{
          tmp += `・${group_list[i][s]}`;
        }
      }
      title[i] = `【${tmp}】掃除`;
      start_date.calendar_app.createEvent(title[i],cleaning_start_dates[i],cleaning_end_dates[i]);
    }
  }catch(err){
    console.log(err.message);
  }
  
}
/**
 * cleaningDutyBot
 * Chatworkから掃除当番を知らせるメッセージを送る関数
 * 
 */
function cleaningDutyBot(){
  const calendar_id = PropertiesService.getUserProperties().getProperty("Calendar_id");
  const calendar_obj = new Calendar(calendar_id);
  var date = new Date();
  const events = calendar_obj.calendar_app.getEventsForDay(date);
  
  const token = PropertiesService.getUserProperties().getProperty("Chatwork_API_Token");
  const room_id = PropertiesService.getUserProperties().getProperty("Chatwork_room_id");
  chatwork = new Chatwork(token,room_id);

  var user_list = [];
  var title = '';

  const myRe = /】掃除$/;
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    //正規表現でイベントのタイトルに「】掃除」を含むか判定
    if(myRe.exec(event.getTitle())){
      tmp = event.getTitle().split(/[【・】]/);
      //tmpのlength回数分だけuser_listにpushする
      for(var s = 1; s < tmp.length-1; s++){
        user_list.push(tmp[s]);
      }
    }
  }
  
  if(user_list?.[0]){
    var tmp = '';
    for(let i=0; i<user_list.length;i++){
      if(i == 0){
        tmp += `${user_list[i]}さん`;
      }else{
        tmp += `・${user_list[i]}さん`;
      }
    }
    title = tmp;
    let message =  `[info][title]掃除当番の連絡です[/title]今週の掃除当番は\
    ${title}です。\n定時後にオフィスの清掃をお願いします。[/info]`;
  
    chatwork.sendMessage(message);
  }else{
    console.log('カレンダーイベントの読み込みに失敗しました。');
  }
}

