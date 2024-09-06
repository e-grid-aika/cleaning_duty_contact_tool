/**
 * createCleaningSchedule
 * 毎月の掃除予定をカレンダーに作成する関数
 * 
 * 毎月1日にこの関数が実行される
 */
function Test2createCleaningSchedule(){
  //スクリプトプロパティに設定しているカレンダーID,スプレッドシートIDを取得
  const calendarId = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  
  //開始と終了用二つのカレンダーオブジェクトを作成
  const startDate = new Calendar(calendarId);
  const endDate = new Calendar(calendarId);
  
  //1カ月の内,金曜日の日付全てを取得する
  //返されるのはオブジェクト
  var cleaningStartDates = startDate.getWeekDay('Friday');
  var cleaningEndDates = endDate.getWeekDay('Friday');

  //掃除の開始・終了時間(時間と分)をスクリプトプロパティから取得
  const cleaningStartHour = PropertiesService.getScriptProperties().getProperty("CleaningStartHour");
  const cleaningStartMinute = PropertiesService.getScriptProperties().getProperty("CleaningStartMinute");
  const cleaningEndHour = PropertiesService.getScriptProperties().getProperty("CleaningEndHour");
  const cleaningEndMinute = PropertiesService.getScriptProperties().getProperty("CleaningEndMinute");

   
}