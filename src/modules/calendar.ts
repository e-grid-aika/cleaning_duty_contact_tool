import { sendMailWithOption } from "../common";

export class Calendar {
  calendarApp: any;

  constructor(calendarId: string) {
    try {
      this.calendarApp = CalendarApp.getCalendarById(calendarId);
      if (this.calendarApp == null) {
        throw new Error(
          "指定されたカレンダーは存在しないかアクセス権がありません。"
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        sendMailWithOption(err.message, "Class Calendar");
      } else {
        console.log("不明なエラー:", err); //エラーメッセージがない場合
      }
    }
  }

  /**
   * 処理を実行した月の指定曜日の日付を取得する
   * weekdayName：日付を取得したい曜日をアルファベットで指定する。
   * holidayCheck：祝日を取得するか否かの指定 true：祝日に日付は取得しない false：祝日の日付も取得する
   */
  getWeekDay(weekdayName: string, holidayCheck = true) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var days = [];
    const weekdayNum = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const publicHolidayCalendarIdString =
      PropertiesService.getScriptProperties().getProperty(
        "PublicHolidayCalendar_id"
      );
    let publicHolidayCalendarId: string;
    if (publicHolidayCalendarIdString != null) {
      publicHolidayCalendarId = publicHolidayCalendarIdString;
    } else {
      throw new Error("PublicHolidayCalendar_idが設定されていません");
    }

    const publicHolidayCalendarObj = new Calendar(publicHolidayCalendarId);

    if (
      typeof weekdayNum[weekdayName] == "number" &&
      weekdayNum[weekdayName] <= 6
    ) {
      for (var i = 1; i <= 31; i++) {
        var tmpDate = new Date(year, month, i);
        if (month !== tmpDate.getMonth()) break; // 月替りで処理終了
        if (tmpDate.getDay() !== weekdayNum[weekdayName]) continue;
        if (holidayCheck) {
          if (
            publicHolidayCalendarObj.calendarApp.getEventsForDay(tmpDate).length
          ) {
            continue;
          } else {
            days.push(tmpDate);
          }
        } else {
          days.push(tmpDate);
        }
      }
      return days;
    } else {
      console.error("曜日が正しく指定されていません");
    }
  }
  /**
   * 引数で指定した曜日に休暇予定のユーザーを取得する
   * weekdayName：曜日をアルファベットで指定する。
   * holidayCheck：祝日を取得するか否かの指定 true：祝日に日付は取得しない false：祝日の日付も取得する
   */
  checkDayOff(weekdayName: string, holidayCheck = true) {
    var days = [];
    var userName = "";
    var userListDayOff = [];
    days = this.getWeekDay(weekdayName, holidayCheck);
    const myRe = /休暇$|休み$|夏季休暇$|:夏季休暇$/;

    //カレンダーのタイトルを取得
    for (var i = 0; i < days.length; i++) {
      if (this.calendarApp.getEventsForDay(days[i]).length) {
        var events = this.calendarApp.getEventsForDay(days[i]);
        for (var t = 0; t < events.length; t++) {
          if (myRe.exec(events[t].getTitle())) {
            userName = events[t].getTitle().split(myRe);

            //休暇予定のあるユーザー名と休暇の日付を配列に代入
            userListDayOff.push([userName[0].trim(), days[i]]);
          }
        }
      }
    }
    return userListDayOff;
  }
}
