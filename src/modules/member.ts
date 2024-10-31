export class Member {
  arrayMember: any[];
  constructor(array: any[]) {
    this.arrayMember = array.flat();
  }

  /**
   * 配列arrayMemberの要素を
   * ランダムに並び替えた配列を返す処理
   */
  getShuffleMember() {
    var shuffleList = Object.assign([], this.arrayMember);
    for (let i = shuffleList.length - 1; 0 <= i; i--) {
      let r = Math.floor(Math.random() * i + 1);
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
   * カレンダーの日程も取り込みその日程に休みを取っている人を取り除く処理も追加する
   * 休みの人がいたら、その人は配列の一番後ろに移動させる
   * もし、全員を確認し終わっても
   */
  createGroup(dayOffMembers = [], cleaningDates = []) {
    //GASで動かす場合のGROUP_COUNTの呼び出し
    const num = Number(
      PropertiesService.getScriptProperties().getProperty("GROUP_COUNT")
    );
    var shuffleMembers: string[] = this.getShuffleMember();
    const loopCounts: number = Math.ceil(shuffleMembers.length / num);
    let arrayGroup: string[] = [];
    let tmp: string[] = [];
    let tmpArray: string[] = [];
    let tmpMember: string;
    let tmpMembers: string[] = [];
    let cleanedMembers: string[] = [];

    if (dayOffMembers.length && cleaningDates.length) {
      //シャッフルした配列を複製
      tmpMembers = shuffleMembers.concat();
      //日にちごとに予定を作成
      cleaningDates.forEach((cleaningDate: Date) => {
        let tmpOffMembers: string[] = [];

        //cleaningDateの日付に休暇予定のあるメンバーを配列tmpOffMembersに退避
        //tmpMembersから休暇予定のあるメンバーを取り除く
        if (dayOffMembers.length) {
          dayOffMembers.forEach((dayOffMember) => {
            if (
              cleaningDate.toDateString() == dayOffMember[1].toDateString() &&
              tmpMembers.includes(dayOffMember[0])
            ) {
              tmpOffMembers.push(dayOffMember[0]);
              tmpMembers.splice(tmpMembers.indexOf(dayOffMember[0]), 1);
            }
          });
        }

        //掃除当番の人数が足りない時、既に掃除当番をした人から新たに追加する
        //当日休みの人は入らないようにする
        while (tmpMembers.length < num) {
          //cleanedMembersの中から足りないメンバーを追加
          let addMember = cleanedMembers.shift();
          if (
            !tmpMembers.includes(addMember) &&
            !tmpOffMembers.includes(addMember)
          ) {
            tmpMembers.push(addMember);
          }
        }

        for (var t = 0; t < tmpMembers.length; t++) {
          cleanedMembers.push(tmpMembers[t]);
        }

        arrayGroup.push(tmpMembers.splice(0, num));
        //退避した休暇予定のメンバーをtmpMembersに戻す
        tmpOffMembers.forEach((tmpOffMember) => tmpMembers.push(tmpOffMember));
      });
    } else {
      if (shuffleMembers.length >= num) {
        for (let i = 0; i < loopCounts; i++) {
          arrayGroup.push(shuffleMembers.slice(i * num, i * num + num));
        }

        //メンバーの数がnumで割り切れない場合
        if (shuffleMembers.length % num != 0) {
          //arrayGroupの最後の要素を取得
          //tmpに保存
          tmp = arrayGroup[arrayGroup.length - 1];

          //arrayGroupから最後の要素を取り除く
          arrayGroup.pop();

          //arrayGroupを1次元配列にしたtmpArrayを作成
          tmpArray = arrayGroup.flat();

          //tmpArrayの中から足りないメンバーを追加
          while (tmp.length != num) {
            tmpMember = tmpArray[Math.floor(Math.random() * tmpArray.length)];
            if (!tmp.includes(tmpMember)) {
              tmp.push(tmpMember);
            }
          }
          //追加メンバーを加えたtmpをarrayGroupに追加
          arrayGroup.push(tmp);
        }
      } else {
        console.error(
          "スクリプトプロパティGROUP_COUNTの値がオフィスメンバーの人数より多いです"
        );
      }
    }
    return arrayGroup;
  }
}
