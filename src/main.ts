import { Chatwork } from "./modules/chatwork";
import { Member } from "./modules/member";
import { Calendar } from "./modules/calendar";
import { setTrigger, sendMailWithOption } from "./common";

function main() {
  //トリガーを実行する時間
  const trigerHourString =
    PropertiesService.getScriptProperties().getProperty("TrigerHour");
  const trigerMinuteString =
    PropertiesService.getScriptProperties().getProperty("TrigerMinute");

  if (trigerHourString === null || trigerMinuteString === null) {
    throw new Error(
      "TrigerHourまたはTrigerMinuteのプロパティが設定されていません"
    );
  }

  // string型からnumber型に変換
  const trigerHour = parseInt(trigerHourString, 10);
  const trigerMinute = parseInt(trigerMinuteString, 10);

  //trigerHour,trigerMinuteで指定した時間に関数cleaningDutyBotを実行するトリガーを作成
  setTrigger("cleaningDutyBot", trigerHour, trigerMinute);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

/**
 * createCleaningSchedule
 * 毎月の掃除予定をカレンダーに作成する関数
 *
 */
function createCleaningSchedule() {
  //スクリプトプロパティに設定しているカレンダーID,スプレッドシートIDを取得
  const calendarIdString =
    PropertiesService.getScriptProperties().getProperty("Calendar_id");

  let calendarId: string;
  if (calendarIdString != null) {
    calendarId = calendarIdString;
  } else {
    throw new Error("Calendar_idが設定されていません");
  }
  //開始と終了用二つのカレンダーオブジェクトを作成
  const startDate: Calendar = new Calendar(calendarId);
  const endDate: Calendar = new Calendar(calendarId);

  //1カ月の内,金曜日の日付を取得する
  let cleaningStartDates = startDate.getWeekDay("Friday");
  let cleaningEndDates = endDate.getWeekDay("Friday");

  //掃除の開始・終了時間(時間と分)をスクリプトプロパティから取得
  const cleaningStartHourString =
    PropertiesService.getScriptProperties().getProperty("CleaningStartHour");
  const cleaningStartMinuteString =
    PropertiesService.getScriptProperties().getProperty("CleaningStartMinute");
  const cleaningEndHourString =
    PropertiesService.getScriptProperties().getProperty("CleaningEndHour");
  const cleaningEndMinuteString =
    PropertiesService.getScriptProperties().getProperty("CleaningEndMinute");

  let cleaningStartHour: string;
  if (cleaningStartHourString != null) {
    cleaningStartHour = cleaningStartHourString;
  } else {
    throw new Error("CleaningStartHourが設定されていません");
  }

  let cleaningStartMinute: string;
  if (cleaningStartMinuteString != null) {
    cleaningStartMinute = cleaningStartMinuteString;
  } else {
    throw new Error("CleaningStartMinuteが設定されていません");
  }

  let cleaningEndHour: string;
  if (cleaningEndHourString != null) {
    cleaningEndHour = cleaningEndHourString;
  } else {
    throw new Error("CleaningEndHourが設定されていません");
  }

  let cleaningEndMinute: string;
  if (cleaningEndMinuteString != null) {
    cleaningEndMinute = cleaningEndMinuteString;
  } else {
    throw new Error("CleaningEndMinuteが設定されていません");
  }

  try {
    //スプレッドシートから米子オフィスメンバーの名前を取得
    const sheetIdString =
      PropertiesService.getScriptProperties().getProperty("Sheet_id");
    let sheetId: string;
    if (sheetIdString != null) {
      sheetId = sheetIdString;
    } else {
      throw new Error("Sheet_idが設定されていません");
    }

    let ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName("読込シート");
    if (sheet != null) {
    } else {
      throw new Error("指定されたシートが存在しません");
    }
    const lastRow = sheet
      .getRange(sheet.getMaxRows(), 1)
      .getNextDataCell(SpreadsheetApp.Direction.UP)
      .getRow();
    const array = sheet.getRange(4, 1, lastRow - 3).getValues();
    const memberList = new Member(array);
    var title = [];
    if (cleaningStartDates != null) {
      cleaningStartDates.forEach((element) =>
        element.setHours(
          parseInt(cleaningStartHour, 10),
          parseInt(cleaningStartMinute, 10)
        )
      );
    } else {
      throw new Error("cleaningStartDatesが存在しません");
    }

    if (cleaningEndDates != null) {
      cleaningEndDates.forEach((element) =>
        element.setHours(
          parseInt(cleaningEndHour, 10),
          parseInt(cleaningEndMinute, 10)
        )
      );
    } else {
      throw new Error("cleaningEndDatesが存在しません");
    }

    const combinedDatesArray = cleaningStartDates.map((item, index) => [
      item,
      cleaningEndDates[index],
    ]);

    for (let i = 0; i < combinedDatesArray.length; i++) {
      existCleaningSchedule(
        calendarId,
        combinedDatesArray[i][0],
        combinedDatesArray[i][1]
      );
    }

    //掃除当番のグループを作成
    let groupList = memberList.createGroup();

    //グループの数が掃除予定日より少ない場合、足りないグループを補填
    if (groupList.length < cleaningStartDates.length) {
      for (
        let groupCnt = 0;
        groupList.length < cleaningStartDates.length;
        groupCnt++
      ) {
        groupList.push(groupList[groupCnt]);
      }
    }

    if (!groupList?.[0]) throw new Error("掃除当番のデータが存在しません");
    for (let i = 0; i < cleaningStartDates.length; i++) {
      var userName = "";
      for (let s = 0; s < groupList[i].length; s++) {
        if (s == 0) {
          userName += `${groupList[i][s]}`;
        } else {
          userName += `・${groupList[i][s]}`;
        }
      }
      title[i] = `【${userName}】掃除`;
      startDate.calendarApp.createEvent(
        title[i],
        cleaningStartDates[i],
        cleaningEndDates[i]
      );
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      sendMailWithOption(err.message, createCleaningSchedule.name); //エラーメッセージを取得できた場合
    } else {
      console.log("不明なエラー:", err); //エラーメッセージがない場合
    }
  }
}

/**
 * reCreateCleaningSchedule
 * 掃除予定を再登録する関数
 */
function reCreateCleaningSchedule(action: string) {
  if (action === "confirm") {
    createCleaningSchedule();
    return "掃除予定が更新されました。";
  } else {
    return "処理がキャンセルされました。";
  }
}

/**
 * existCleaningSchedule
 * 掃除予定日に既に掃除の予定が入っている場合、削除する関数
 */
function existCleaningSchedule(
  calendarId: string,
  cleaningStartDates: Date,
  cleaningEndDates: Date
) {
  const myCalendar: Object = CalendarApp.getCalendarById(calendarId);
  let events: Object = myCalendar.getEvents(
    cleaningStartDates,
    cleaningEndDates
  );
  const eventNum: number = events.length;
  const myRe = /】掃除$/;

  //予定のタイトルに"】掃除"が含まれている予定を削除
  for (let i = 0; i < eventNum; i++) {
    if (myRe.exec(events[i].getTitle())) {
      events[i].deleteEvent(); //予定の削除
    }
  }
}

/**
 * cleaningDutyBot
 * Chatworkから掃除当番を知らせるメッセージを送る関数
 *
 */
function cleaningDutyBot() {
  const calendarId =
    PropertiesService.getScriptProperties().getProperty("Calendar_id");
  const calendarObj = new Calendar(calendarId);
  var date = new Date();
  const events = calendarObj.calendarApp.getEventsForDay(date);

  const tokenString =
    PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
  const roomIdString =
    PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");

  let token: string;
  if (tokenString != null) {
    token = tokenString;
  } else {
    throw new Error("Chatwork_API_Tokenが設定されていません");
  }

  let roomId: string;
  if (roomIdString != null) {
    roomId = roomIdString;
  } else {
    throw new Error("Chatwork_room_idが設定されていません");
  }

  let chatwork = new Chatwork(token, roomId);

  var userList = [];
  var title = "";

  const myRe = /】掃除$/;

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    //正規表現でイベントのタイトルに「】掃除」を含むか判定
    if (myRe.exec(event.getTitle())) {
      let userNameArray = event.getTitle().split(/[【・】]/);
      //userNameArrayのlength回数分だけuserListにpushする
      for (var s = 1; s < userNameArray.length - 1; s++) {
        userList.push(userNameArray[s]);
      }
    }
  }

  if (userList?.[0]) {
    var title = "";
    for (let i = 0; i < userList.length; i++) {
      if (i == 0) {
        title += `${userList[i]}さん`;
      } else {
        title += `・${userList[i]}さん`;
      }
    }
    let message = `[info][title]🧹掃除当番の連絡です🧹[/title]今週の掃除当番は\
      ${title}です。\n定時後にオフィスの清掃をお願いします。[/info]`;

    chatwork.sendMessage(message);
  } else {
    let errMessage = "カレンダーから掃除予定が読み込めませんでした。";
    console.log(errMessage);
    //読込失敗した際に管理者にメール送信する
    sendMailWithOption(errMessage, cleaningDutyBot.name);
  }
}

declare let global: any;
(global as any).main = main;
(global as any).doGet = doGet;
(global as any).createCleaningSchedule = createCleaningSchedule;
(global as any).reCreateCleaningSchedule = reCreateCleaningSchedule;
(global as any).existCleaningSchedule = existCleaningSchedule;
(global as any).cleaningDutyBot = cleaningDutyBot;
