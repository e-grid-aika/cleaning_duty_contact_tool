/**
 * 掃除スケジュールの自動作成テスト
 * 金曜日の18:00~18:30に掃除の予定を一ヶ月分作成できることを確認
 */
function TestCreateCleaningSchedule(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  
  //開始と終了用二つのカレンダーオブジェクトを作成する必要がある
  const start_date = new Calendar(calendar_id);
  const end_date = new Calendar(calendar_id);

  //休暇予定者取得用
  const day_off = new Calendar(calendar_id);
  
  //1カ月の内,金曜日の日付を取得する
  var cleaning_start_dates = start_date.getWeekDay('Friday');
  var cleaning_end_dates = end_date.getWeekDay('Friday');

  //掃除の開始・終了時間(時間と分)をスクリプトプロパティから取得
  const CleaningStartHour = PropertiesService.getScriptProperties().getProperty("CleaningStartHour");
  const CleaningStartMinute = PropertiesService.getScriptProperties().getProperty("CleaningStartMinute");
  const CleaningEndHour = PropertiesService.getScriptProperties().getProperty("CleaningEndHour");
  const CleaningEndMinute = PropertiesService.getScriptProperties().getProperty("CleaningEndMinute");

  try{
    //スプレッドシートから米子オフィスメンバーの名前を取得
    const sheet_id = PropertiesService.getScriptProperties().getProperty("Sheet_id");
    let ss = SpreadsheetApp.openById(sheet_id);
    var sheet = ss.getSheetByName("読込シート");
    const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
    const array = sheet.getRange(4,1,lastRow-3).getValues();
    const member_list = new Member(array);
    
    var title = [];
    
    //金曜日に休暇を取っているメンバーを取得
    var dayoff_member =  day_off.checkDayOff('Friday');

    //掃除当番のグループを作成
    group_list = member_list.createGroup(dayoff_member,cleaning_start_dates);
    console.log(group_list);

    // cleaning_start_dates.forEach((element) => element.setHours(CleaningStartHour,CleaningStartMinute));
    // cleaning_end_dates.forEach((element) => element.setHours(CleaningEndHour,CleaningEndMinute));

    // //グループの数が掃除予定日より少ない場合、足りないグループを補填
    // if(group_list.length < cleaning_start_dates.length){
    //   for(let group_cnt=0; group_list.length < cleaning_start_dates.length; group_cnt++){
    //     group_list.push(group_list[group_cnt]);
    //   }
    // }

    //カレンダーに掃除の予定日を追加
    // for(let i=0; i<cleaning_start_dates.length; i++){
    //   var tmp = '';
    //   for(let s=0; s<group_list[i].length; s++){
    //     if(s == 0){
    //       tmp += `${group_list[i][s]}`;
    //     }else{
    //       tmp += `・${group_list[i][s]}`;
    //     }
    //   }
      
    //   title[i] = `【${tmp}】掃除`;
    //   // start_date.calendar_app.createEvent(title[i],cleaning_start_dates[i],cleaning_end_dates[i]);
    // }
  }catch(err){
    console.log(err.message);
    sendMailWithOption(err.message,TestCreateCleaningSchedule.name);
  }
}
/**
 * Chatworkbot_テスト
 * 
 * ChatworkAPIを使って、テスト用のルームにメッセージを送れるか確認
 * カレンダーにダミーの予定追加してから実行する　予定のタイトルを「【人名１・人名２】～～～～」とする
 */
function TestCleaningDutyBot(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("TestCalendar_id");
  const calendar_obj = new Calendar(calendar_id);
  
  var date = new Date();
  const events = calendar_obj.calendarApp.getEventsForDay(date);
  
  const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
  const room_id = PropertiesService.getScriptProperties().getProperty("TestChatwork_room_id");
  
  var user_list = [];
  var title;
  
  chatwork = new Chatwork(token,room_id);
  
  const myRe = /】掃除$/;
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    //正規表現でイベントのタイトルに「】掃除」を含むか判定
    if(myRe.exec(event.getTitle())){
      tmp = event.getTitle().split(/[【・】]/);
      console.log(tmp.length);
      console.log(tmp);
      //tmpのlength回数分だけuser_listにpushする
      for(var s = 1; s < tmp.length-1; s++){
        user_list.push(tmp[s]);
      }
    }
  }

  //Chatwork APIでメッセージを送信
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
    
    let message =  `[info][title]🧹掃除当番の連絡です🧹[/title]今週の掃除当番は\
    ${title}です。\n定時後にオフィスの清掃をお願いします。[/info]`;
    chatwork.sendMessage(message);
  }else{
    let err_message = 'カレンダーイベントの読み込みに失敗しました。';
    console.log(err_message);
    //読込失敗した際に管理者にメール送信する
    sendMailWithOption(err_message,TestCleaningDutyBot.name);
  }
}

/**
 * Calendarクラス_テスト
 * getWeekDay():曜日ごとの日付を取得する
 * */
function TestCalendar(){
  const calendar_id = PropertiesService.getScriptProperties().getProperty("TestCalendar_id");
  const test_calendar = new Calendar(calendar_id);

  // console.log(test_calendar.getWeekDay('Sunday')); //日曜日の日付
  // console.log(test_calendar.getWeekDay('Monday',true)); //月曜日の日付(祝日は除く)
  // console.log(test_calendar.getWeekDay('Monday',false)); //月曜日の日付(祝日も含める)
  // console.log(test_calendar.getWeekDay('Tuesday')); //火曜日の日付
  // console.log(test_calendar.getWeekDay('Wednesday')); //水曜日の日付
  // console.log(test_calendar.getWeekDay('Thursday')); //木曜日の日付
  // console.log(test_calendar.getWeekDay('Friday')); //金曜日の日付
  // console.log(test_calendar.getWeekDay('Saturday')); //土曜日の日付
  // console.log(test_calendar.getWeekDay('Manday')); //エラー

 var dayoff_member =  test_calendar.checkDayOff('Friday');
 console.log(dayoff_member);
}

/**
 * Memberクラス_テスト
 * getShuffleMember():member_listの中身をランダムに並び替える
 * reatePair()：member_listからグループを作成する
 * */
function TestMember(){
  //スプレッドシートからオフィスメンバーの名前を取得
  const sheet_id = PropertiesService.getScriptProperties().getProperty("Sheet_id");
  let ss = SpreadsheetApp.openById(sheet_id);
  var sheet = ss.getSheetByName("読込シート");
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  const array = sheet.getRange(4,1,lastRow-3).getValues();
  const member_list = new Member(array);
  
  group_list = member_list.createGroup();

  

  console.log(member_list); //オフィスメンバーの名前を表示
  console.log(group_list); 
}




