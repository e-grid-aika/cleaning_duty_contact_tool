/**
 * Chatworkへのメッセージ送信処理を行うクラス
 */
class Chatwork{
  constructor(token, roomId){
    
    this.token = token /* ChatWork APIトークン*/
    this.roomId = roomId;  /* ChatWork ルームID*/
    this.client = ChatWorkClient.factory({token: this.token}); /* ChatworkAPIクライアント作成 */

  }
  /**
   * 指定したChatworkのルームIDにメッセージを送信する処理
   */
  sendMessage(message){
    try {
      this.client.sendMessage({
        room_id: this.roomId,
        body: message,
      });
    }catch (err) {
      console.log('Failed with error %s',err.message);
      sendMailWithOption(err.message,this.sendMessage.name);
    }
  }
}