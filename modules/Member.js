// require('dotenv').config()
class Member{
  constructor(array){
    this.array_member = array.flat();
  }

  getShuffleMember(){
    //ランダムに並び替えたメンバーの配列を返す処理
    var shuffle_list = Object.assign([], this.array_member);
    for(let i=shuffle_list.length-1; 0<=i; i--){
      let r = Math.floor(Math.random()*i+1);
      var tmp;
      tmp = shuffle_list[i];
      shuffle_list[i] = shuffle_list[r];
      shuffle_list[r] = tmp;
    }
    return shuffle_list;
  }

  /**
   * 掃除当番のグループを作成
   * 1グループの人数はスクリプトプロパティGROUP_COUNTの値で設定
   */
  createGroup(){
    var shuffle_members;

    // const num = Number(process.env.GROUP_COUNT);//GASで使用する場合はコメントアウトする
    
    //GASで動かす場合のGROUP_COUNTの呼び出し
    const num = Number(PropertiesService.getScriptProperties().getProperty("GROUP_COUNT"));
    var shuffle_members = this.getShuffleMember();
    const loop_counts = Math.ceil(shuffle_members.length/num);
    let array_group = [];
    let tmp = [];
    let tmp_array =[];
    let tmp_member;
    if(shuffle_members.length >= num){
      for(let i=0; i < loop_counts; i++){
        array_group.push(shuffle_members.slice(i*num,i*num+num));
      }
    
      //メンバーの数がnumで割り切れない場合
      if(shuffle_members.length % num != 0){
      //array_groupの最後の要素を取得
      //tmpに保存
      tmp = array_group[array_group.length-1];
      
      //array_groupから最後の要素を取り除く
      array_group.pop();
      
      //array_groupを1次元配列にしたtmp_arrayを作成
      tmp_array = array_group.flat();

        //tmp_arrayの中から足りないメンバーを追加
        while(tmp.length != num){
          tmp_member = tmp_array[Math.floor(Math.random()*tmp_array.length)];
          if(!tmp.includes(tmp_member)){
            tmp.push(tmp_member);
          }
        }
      //その要素とtmpでグループを作り、array_groupに追加
        array_group.push(tmp);
      }
      return array_group;
    }else{
      console.error('スクリプトプロパティGROUP_COUNTの値がオフィスメンバーの人数より多いです')
    }
  }
}
// module.exports = Member //GASで動かす場合はコメントアウトする
