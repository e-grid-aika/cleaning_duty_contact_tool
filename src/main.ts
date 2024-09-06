function main(){

  //トリガーを実行する時間
  const trigerHour = PropertiesService.getScriptProperties().getProperty("TrigerHour");
  const trigerMinute = PropertiesService.getScriptProperties().getProperty("TrigerMinute");
  
  //trigerHour,trigerMinuteで指定した時間に関数cleaningDutyBotを実行するトリガーを作成
  setTrigger('cleaningDutyBot',trigerHour,trigerMinute);
}
