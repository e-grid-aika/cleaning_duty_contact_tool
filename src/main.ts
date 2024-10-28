import { setTrigger,sendMailWithOption } from "./common";

function main(){

  //トリガーを実行する時間
  const trigerHourString = PropertiesService.getScriptProperties().getProperty("TrigerHour");
  const trigerMinuteString = PropertiesService.getScriptProperties().getProperty("TrigerMinute");
  
  if (trigerHourString === null || trigerMinuteString === null) {
    throw new Error("TrigerHourまたはTrigerMinuteのプロパティが設定されていません");
  }

  // string型からnumber型に変換
  const trigerHour = parseInt(trigerHourString, 10);
  const trigerMinute = parseInt(trigerMinuteString, 10);

  //trigerHour,trigerMinuteで指定した時間に関数cleaningDutyBotを実行するトリガーを作成
  setTrigger('cleaningDutyBot',trigerHour,trigerMinute);
}

declare let global: any;
(global as any).main = main;