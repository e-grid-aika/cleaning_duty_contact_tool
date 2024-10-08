/**
 * Chatworkへのメッセージ送信処理を行うクラス
 */
export class Chatwork{
  token: string;
  roomId: string;
  client: object;

  constructor(token: string, roomId: string){
    
    this.token = token /* ChatWork APIトークン*/
    this.roomId = roomId;  /* ChatWork ルームID*/
    this.client = ChatWorkClient.factory({token: this.token}); /* ChatworkAPIクライアント作成 */

  }
  /**
   * 指定したChatworkのルームIDにメッセージを送信する処理
   */
  sendMessage(message: string): void{
    try {
      this.client.sendMessage({
        room_id: this.roomId,
        body: message,
      });
    }catch (err) {
      console.error(`Failed with error ${err.message}`);
    }
  }
}