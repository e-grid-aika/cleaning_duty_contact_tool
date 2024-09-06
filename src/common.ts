/**
 * setTrigger
 * 指定時間に関数を実行するトリガー
 * @param {string} [funcName=''] トリガー実行したい関数名
 * @param {number} [hour=8]  トリガー実行したい時間(デフォルトは8時)
 * @param {number} [minutes=59] トリガー実行したい分(デフォルトは59分)
 */

function setTrigger(funcName = '',hour = 8, minutes = 59){
    //Dateオブジェクトで実行した時間を取得
    let time = new Date();
    //setHours,setMinutesで関数funcNameを実行する時間を設定
    time.setHours(hour);
    time.setMinutes(minutes);
    ScriptApp.newTrigger(funcName).timeBased().at(time).create();
}

/**
 * sendMailWithOption
 * エラーが出た場合の通知メールを送信する処理
 * 
 * メールの差出人を変える場合は「adminEmail」のメールアドレスを変更する
 * 
 * 注意：GASでGmailを送信する場合、送信元のアドレスはGASを
 * 　　　実行したアカウントに紐づくアドレスである必要がある。
 * 　　　GASを実行したアカウントに紐づいていないアドレスを使用するとエラーになる。
 */
function sendMailWithOption(message: string, errFunction: string) {
 
  const adminEmail = PropertiesService.getScriptProperties().getProperty("AdminMailAddress");  //差出人のメールアドレス
  const subject = '~~掃除当番ツールエラー報告~~';            // メールの件名
  let userEmail: string = PropertiesService.getScriptProperties().getProperty("AdminMailAddress");   //送信先のメールアドレス
    
  const options = { from: adminEmail, name: '掃除当番管理者'};
    
  //メール本文
  let body = `
  ----------------------------------------------------------------------------------
  ※ このメールは「掃除当番連絡ツール」のからの自動送信メールです。
  ----------------------------------------------------------------------------------
  以下の処理でエラーが発生しました。

  処理内容：`+ errFunction + 
  `\n` +
  `エラー内容：` + message;

  GmailApp.sendEmail(userEmail, subject, body, options);
  
}