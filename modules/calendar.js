class Calendar{
  constructor(calendarId){
    this.calendarId = calendarId;
    try{
      this.calendarApp = CalendarApp.getCalendarById(this.calendarId);
      if(this.calendarApp == null){
        throw new Error("指定されたカレンダーは存在しないかアクセス権がありません。");
      }
    }catch (err) {
      console.error(err);
      sendMailWithOption(err.message,'Class Calendar');
    }
  }

  /**
   * 処理を実行した月の指定曜日の日付を取得する
   * weekdayName：日付を取得したい曜日をアルファベットで指定する。
   */
  getWeekDay(weekdayName,holidayCheck=true){
    var date  = new Date('2024-10-01T03:24:00');
    var year  = date.getFullYear();
    var month = date.getMonth();
    var days  = [];
    const weekdayNum = {'Sunday':0,'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4,'Friday':5,'Saturday':6};
    const publicHolidayCalendarId = PropertiesService.getScriptProperties().getProperty("PublicHolidayCalendar_id");
    const publicHolidayCalendarObj = new Calendar(publicHolidayCalendarId);

    if(typeof(weekdayNum[weekdayName])=='number'&&weekdayNum[weekdayName]<=6){
      for (var i=1; i <= 31; i++){
        var tmpDate = new Date(year, month, i);
        if (month !== tmpDate.getMonth()) break;  // 月替りで処理終了
        if (tmpDate.getDay() !== weekdayNum[weekdayName]) continue;
        if(holidayCheck){                        //祝日の場合は日付を取得しない
          if(publicHolidayCalendarObj.calendarApp.getEventsForDay(tmpDate).length){
            continue;
          }else{
            days.push(tmpDate);
          }
        }else{
            days.push(tmpDate);
        } 
      }
      return days;  
    }else{
      console.error('曜日が正しく指定されていません');
    } 
  }
  
}


