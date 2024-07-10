class Chatwork{
  constructor(token, room_id){
    
    this.token = token /* ChatWork APIトークン*/
    this.room_id = room_id;  /* ChatWork ルームID*/
    this.client = ChatWorkClient.factory({token: this.token}); /* ChatworkAPIクライアント作成 */

  }
  sendMessage(send_message){
    try {
      this.client.sendMessage({
        room_id: this.room_id,
        body: send_message,
      });
    }catch (err) {
      console.log('Failed with error %s',err.message);
    }
  }
}