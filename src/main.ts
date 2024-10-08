import { setTrigger,sendMailWithOption } from "./common";
import { Chatwork } from "./modules/chatwork";

function main(){

  //トリガーを実行する時間
  const trigerHour: number = PropertiesService.getScriptProperties().getProperty("TrigerHour");
  const trigerMinute: number = PropertiesService.getScriptProperties().getProperty("TrigerMinute");
  
  //trigerHour,trigerMinuteで指定した時間に関数cleaningDutyBotを実行するトリガーを作成
  setTrigger('cleaningDutyBot',trigerHour,trigerMinute);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

/**
 * reCreateCleaningSchedule
 * 掃除予定を再登録する関数
 */
function reCreateCleaningSchedule(action: string){
  if(action === 'confirm'){
    createCleaningSchedule();
    return '掃除予定が更新されました。'
  }else{
    return '処理がキャンセルされました。'
  }
}

/**
 * createCleaningSchedule
 * 毎月の掃除予定をカレンダーに作成する関数
 * 
 */
function createCleaningSchedule(){
  //スクリプトプロパティに設定しているカレンダーID,スプレッドシートIDを取得
  const calendarId: number = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  
  //開始と終了用二つのカレンダーオブジェクトを作成
  const startDate: Object = new Calendar(calendarId);
  const endDate: Object = new Calendar(calendarId);
  
  //1カ月の内,金曜日の日付を取得する
  let cleaningStartDates = startDate.getWeekDay('Friday');
  let cleaningEndDates = endDate.getWeekDay('Friday');

  //掃除の開始・終了時間(時間と分)をスクリプトプロパティから取得
  const cleaningStartHour = PropertiesService.getScriptProperties().getProperty("CleaningStartHour");
  const cleaningStartMinute = PropertiesService.getScriptProperties().getProperty("CleaningStartMinute");
  const cleaningEndHour = PropertiesService.getScriptProperties().getProperty("CleaningEndHour");
  const cleaningEndMinute = PropertiesService.getScriptProperties().getProperty("CleaningEndMinute");
 
  try{
    //スプレッドシートから米子オフィスメンバーの名前を取得
    const sheetId = PropertiesService.getScriptProperties().getProperty("Sheet_id");
    let ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName("読込シート");
    const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
    const array = sheet.getRange(4,1,lastRow-3).getValues();
    const memberList = new Member(array);
    
    var title = [];

    cleaningStartDates.forEach((element) => element.setHours(cleaningStartHour,cleaningStartMinute));
    cleaningEndDates.forEach((element) => element.setHours(cleaningEndHour,cleaningEndMinute));

    
    const combinedDatesArray = cleaningStartDates.map((item, index) => [item, cleaningEndDates[index]]);
    // console.log(combinedArray);
    // console.log(combinedArray.length);
    
    for(let i=0;i<combinedDatesArray.length;i++){
      existCleaningSchedule(calendarId,combinedDatesArray[i][0],combinedDatesArray[i][1]);
    }
    
    //掃除当番のグループを作成
    groupList = memberList.createGroup();

    //グループの数が掃除予定日より少ない場合、足りないグループを補填
    if(groupList.length < cleaningStartDates.length){
      for(let groupCnt=0; groupList.length < cleaningStartDates.length; groupCnt++){
        groupList.push(groupList[groupCnt]);
      }
    }
    
    if(!groupList?.[0]) throw new Error('掃除当番のデータが存在しません')
    for(let i=0; i<cleaningStartDates.length; i++){
      var userName = '';
      for(let s=0; s < groupList[i].length; s++){
        if(s == 0){
          userName += `${groupList[i][s]}`;
        }else{
          userName += `・${groupList[i][s]}`;
        }
      }
      title[i] = `【${userName}】掃除`;
      startDate.calendarApp.createEvent(title[i],cleaningStartDates[i],cleaningEndDates[i]);
    }
  }catch(err){
    console.log(err.message);
    sendMailWithOption(err.message,createCleaningSchedule.name);
  }
  
}
/**
 * existCleaningSchedule
 * 掃除予定日に既に掃除の予定が入っている場合、削除する関数
 */
function existCleaningSchedule(calendarId: string,cleaningStartDates: Date,cleaningEndDates: Date){
  
  const myCalendar: Object = CalendarApp.getCalendarById(calendarId);
  let events: Object = myCalendar.getEvents(cleaningStartDates,cleaningEndDates);
  const eventNum: number = events.length;
  const myRe = /】掃除$/;

  //予定のタイトルに"】掃除"が含まれている予定を削除
  for (let i = 0; i < eventNum; i++) {
    if(myRe.exec(events[i].getTitle())){
      events[i].deleteEvent();//予定の削除
    }
  }
}

/**
 * cleaningDutyBot
 * Chatworkから掃除当番を知らせるメッセージを送る関数
 * 
 */
function cleaningDutyBot(){
  const calendarId = PropertiesService.getScriptProperties().getProperty("Calendar_id");
  const calendarObj = new Calendar(calendarId);
  var date = new Date();
  const events = calendarObj.calendarApp.getEventsForDay(date);
  
  const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
  const roomId = PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");
  let chatwork = new Chatwork(token,roomId);

  var userList = [];
  var title = '';

  const myRe = /】掃除$/;
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    //正規表現でイベントのタイトルに「】掃除」を含むか判定
    if(myRe.exec(event.getTitle())){
      let userNameArray = event.getTitle().split(/[【・】]/);
      //userNameArrayのlength回数分だけuserListにpushする
      for(var s = 1; s < userNameArray.length-1; s++){
        userList.push(userNameArray[s]);
      }
    }
  }
  
  if(userList?.[0]){
    var title = '';
    for(let i=0; i<userList.length;i++){
      if(i == 0){
        title += `${userList[i]}さん`;
      }else{
        title += `・${userList[i]}さん`;
      }
    }
    let message =  `[info][title]🧹掃除当番の連絡です🧹[/title]今週の掃除当番は\
    ${title}です。\n定時後にオフィスの清掃をお願いします。[/info]`;
  
    chatwork.sendMessage(message);
  }else{
    let errMessage = 'カレンダーから掃除予定が読み込めませんでした。';
    console.log(errMessage);
    //読込失敗した際に管理者にメール送信する
    sendMailWithOption(errMessage,cleaningDutyBot.name);
    
  }
}

declare let global: any;
(global as any).main = main;
(global as any).doGet = doGet;
(global as any).reCreateCleaningSchedule = reCreateCleaningSchedule;
