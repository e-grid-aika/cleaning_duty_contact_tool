class Calendar{
  constructor(calendar_id){
    this.calendar_id = calendar_id;
    try{
      this.calendar_app = CalendarApp.getCalendarById(this.calendar_id);
      if(this.calendar_app == null){
        throw new Error("指定されたカレンダーは存在しないかアクセス権がありません。");
      }
    }catch (err) {
      console.error(err);
    }
  }

  getWeekDay(weekday_name,holiday_check=true){
    // 処理を実行した月の指定曜日の日付を取得する
    // weekday_num：日付を取得したい曜日をアルファベットで指定する。
    var date  = new Date();
    var year  = date.getFullYear();
    var month = date.getMonth();
    var days  = [];
    const weekday_num = {'Sunday':0,'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4,'Friday':5,'Saturday':6};
    const public_holiday_calendar_id = PropertiesService.getScriptProperties().getProperty("PublicHolidayCalendar_id");
    const public_holiday_calendar_obj = new Calendar(public_holiday_calendar_id);

    if(typeof(weekday_num[weekday_name])=='number'&&weekday_num[weekday_name]<=6){
      for (var i=1; i <= 31; i++){
        var tmpDate = new Date(year, month, i);
        if (month !== tmpDate.getMonth()) break;  // 月替りで処理終了
        if (tmpDate.getDay() !== weekday_num[weekday_name]) continue;
        if(holiday_check){                        //祝日の場合は日付を取得しない
          if(public_holiday_calendar_obj.calendar_app.getEventsForDay(tmpDate).length){
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


