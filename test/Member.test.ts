
import {Member} from "../src/modules/member";

//テストデータの数が奇数の場合
var test_data_odd = ['Taro','Jiro','Saburo','Shiro','Goro'];
const testMember_odd = new Member(test_data_odd);
//テストデータの数が6の場合
var test_data_even = [
  'Taro',
  'Jiro',
  'Saburo',
  'Shiro',
  'Goro',
  'Rokuro',
  'Shichiro',
  'Hachiro',
  'Kuro',
  'Juro'
];
const testMember_even = new Member(test_data_even);
test('Calendarのテスト', () => {
  // expect(testMember_odd).toEqual({"array_member": ["Taro", "Jiro", "Saburo", "Shiro", "Goro"]});
  // expect(testMember_odd.getShuffleMember()).toContain("Taro","Jiro","Saburo", "Shiro", "Goro");
  // expect(testMember_odd.createPair().length).toEqual(3);

  expect(testMember_even).toEqual({"array_member": ["Taro", "Jiro", "Saburo", "Shiro", "Goro",'Rokuro']});
  

  
});
