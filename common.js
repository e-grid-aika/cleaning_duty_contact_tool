/**
 * setTrigger
 * 指定時間に関数を実行するトリガー
 * @param {string} [func_name=''] トリガー実行したい関数名
 * @param {number} [hour=8]  トリガー実行したい時間(デフォルトは8時)
 * @param {number} [minutes=59] トリガー実行したい分(デフォルトは59分)
 */

function setTrigger(func_name = '',hour = 8, minutes = 59){
    //Dateオブジェクトで実行した時間を取得
    let time = new Date();
    //setHours,setMinutesで関数func_nameを実行する時間を設定
    time.setHours(hour);
    time.setMinutes(minutes);
    ScriptApp.newTrigger(func_name).timeBased().at(time).create();
}