class Member{
  constructor(array_member){
    this.array_member = array_member;
  }

  getShuffleMember(){
    //ランダムに並び替えたメンバーの配列を返す処理
    for(let i=this.array_member.length-1; 0<=i; i--){
      let r = Math.floor(Math.random()*i+1);
      var tmp;
      tmp = this.array_member[i];
      this.array_member[i] = this.array_member[r];
      this.array_member[r] = tmp;
    }
    return this.array_member;
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
    let tmp_pair = [];
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
