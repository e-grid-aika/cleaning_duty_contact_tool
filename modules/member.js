
class Member{
  constructor(array){
    this.arrayMember = array.flat();
  }

  /**
   * 配列arrayMemberの要素を
   * ランダムに並び替えた配列を返す処理
   */
  getShuffleMember(){
    var shuffleList = Object.assign([], this.arrayMember);
    for(let i=shuffleList.length-1; 0<=i; i--){
      let r = Math.floor(Math.random()*i+1);
      var tmp;
      tmp = shuffleList[i];
      shuffleList[i] = shuffleList[r];
      shuffleList[r] = tmp;
    }
    return shuffleList;
  }

  /**
   * 掃除当番のグループを作成
   * 1グループの人数はスクリプトプロパティGROUP_COUNTの値で設定
   */
  createGroup(){
    var shuffleMembers;

    // const num = Number(process.env.GROUP_COUNT);//GASで使用する場合はコメントアウトする
    
    //GASで動かす場合のGROUP_COUNTの呼び出し
    const num = Number(PropertiesService.getScriptProperties().getProperty("GROUP_COUNT"));
    var shuffleMembers = this.getShuffleMember();
    const loopCounts = Math.ceil(shuffleMembers.length/num);
    let arrayGroup = [];
    let tmp = [];
    let tmpArray =[];
    let tmpMember;
    if(shuffleMembers.length >= num){
      for(let i=0; i < loopCounts; i++){
        arrayGroup.push(shuffleMembers.slice(i*num,i*num+num));
      }
    
      //メンバーの数がnumで割り切れない場合
      if(shuffleMembers.length % num != 0){
      //arrayGroupの最後の要素を取得
      //tmpに保存
      tmp = arrayGroup[arrayGroup.length-1];
      
      //arrayGroupから最後の要素を取り除く
      arrayGroup.pop();
      
      //arrayGroupを1次元配列にしたtmpArrayを作成
      tmpArray = arrayGroup.flat();

        //tmpArrayの中から足りないメンバーを追加
        while(tmp.length != num){
          tmpMember = tmpArray[Math.floor(Math.random()*tmpArray.length)];
          if(!tmp.includes(tmpMember)){
            tmp.push(tmpMember);
          }
        }
      //その要素とtmpでグループを作り、arrayGroupに追加
        arrayGroup.push(tmp);
      }
      return arrayGroup;
    }else{
      console.error('スクリプトプロパティGROUP_COUNTの値がオフィスメンバーの人数より多いです')
    }
  }
}
