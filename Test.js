function TestCreateSchedule(){
  //イベントの開始と終了用のカレンダーオブジェクトを二つ作成する必要がある
  const test_calendar1 = new Calendar('任意のカレンダーID');
  const test_calendar2 = new Calendar('任意のカレンダーID');
  var cleaning_start_dates = test_calendar1.getFriday();
  var cleaning_end_dates = test_calendar2.getFriday();
  
  cleaning_start_dates.forEach((element) => element.setHours(18,00,00));
  cleaning_end_dates.forEach((element) => element.setHours(18,30,00));
  console.log(cleaning_start_dates);
  console.log(cleaning_end_dates);
  //title 掃除をする人を含めたタイトル
  title = '掃除';
  // cleaning_start_datesとcleaning_end_datesの要素数は必ず同じになる
  for(let i=0; i<cleaning_start_dates.length; i++){
    test_calendar1.createSchedule(title,cleaning_start_dates[i],cleaning_end_dates[i]);
  }
}

function TestSlectMember(){
  //掃除を行うメンバーを選択する機能
  //掃除メンバーはスプレッドシートから取得
  
  let ss = SpreadsheetApp.openById("任意のスプレッドシートID");
  var sheet = ss.getSheetByName("読込シート");
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  const array = sheet.getRange(4,1,lastRow-3).getValues();

  // console.log(array.flat());
  const member_list = new Member(array.flat());
  
  //メンバーを２人１組のペアにする処理
  console.log(member_list.createPair());

}

function myTestFunction() {

  let ss = SpreadsheetApp.openById("任意のスプレッドシートID");
  var sheet = ss.getSheetByName("読込シート");
  const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  const array = sheet.getRange(4,1,lastRow-3).getValues();

  // console.log(array.flat());
  const member_list = new Member(array.flat());
  
  //掃除当番のペア
  user_list = member_list.createPair()
  // console.log(user_list);

  let message =  '[info][title]掃除当番の連絡です[/title]今日の掃除当番は' + 
  user_list[0][0] + `さん`+ user_list[0][1] +`さんです。定時後にオフィスの清掃をお願いします。[/info]`;
  
  console.log(message);

  const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
  const room_id = PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");
  chatwork = new Chatwork(token,room_id);
  chatwork.sendMessage(message);
  
}

