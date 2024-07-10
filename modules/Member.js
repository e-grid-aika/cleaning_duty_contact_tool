class Member{
  constructor(){
    //スプレッドシートからオフィスメンバーの名前を取得
    const sheet_id = PropertiesService.getScriptProperties().getProperty("Sheet_id");
    let ss = SpreadsheetApp.openById(sheet_id);
    var sheet = ss.getSheetByName("読込シート");
    const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
    const array = sheet.getRange(4,1,lastRow-3).getValues();
    
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

  createPair(){
    //掃除当番のペアを作成
    var shuffle_members;
    const num = 2;
    var shuffle_members = this.getShuffleMember();
    const loop_counts = Math.ceil(shuffle_members.length/num);
    let array_pair = [];
    let tmp;
    let tmp_array =[];
    let tmp_member;
    for(let i=0; i < loop_counts; i++){
      array_pair.push(shuffle_members.slice(i*num,i*num+num));
    }
    //ペアの数が奇数の場合の処理
    if(shuffle_members.length % 2 == 1){
      //array_pairの最後の要素を取得
      //tmpに保存
      tmp = array_pair[array_pair.length-1];
      
      //配列の最後の要素を取り除く
      array_pair.pop();
      
      //array_pairを1次元配列にしたtmp_arrayを作成
      tmp_array = array_pair.flat();

      //tmp_arrayの中からtmpとペアを組む要素を取り出す
      tmp_member = tmp_array[Math.floor(Math.random()*tmp_array.length)];
      tmp.push(tmp_member);
    

      //その要素とtmpでペアを作り、array_pairに追加
      array_pair.push(tmp);
    }
    return array_pair;
  }
}
