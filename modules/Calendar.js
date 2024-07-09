module.exports =  class Calendar{
  constructor(calendar_id){
    this.calendar_id = calendar_id;
    this.calendar_app = CalendarApp.getCalendarById(this.calendar_id);
    
  }

  getName(){
    return this.calendar_app.getName()
  }

  getFriday(){
    // 毎月の金曜日の日付を取得する関数
    var date  = new Date();
    var year  = date.getFullYear();
    var month = date.getMonth();
    var days  = [];

    for (var i=1; i <= 31; i++){
      var tmpDate = new Date(year, month, i);
      if (month !== tmpDate.getMonth()) break;  // 月替りで処理終了
      if (tmpDate.getDay() !== 5) continue;  // 金曜日
      days.push(tmpDate);
    }
    return days;
  }

  createSchedule(event_title,date_start,date_end){
    this.calendar_app.createEvent(event_title,new Date(date_start),new Date(date_end));
  }

  getTodayEvents(){
    var date = new Date();
    var events = this.calendar_app.getEventsForDay(date);
    return events;
  }
}


