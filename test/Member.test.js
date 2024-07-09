const Member = require('../modules/Member');
//テストデータの数が奇数の場合
var test_data_odd = ['Taro','Jiro','Saburo','Shiro','Goro'];
const testMember_odd = new Member(test_data_odd);
//テストデータの数が偶数の場合
var test_data_even = ['Taro','Jiro','Saburo','Shiro','Goro','Rokuro'];
const testMember_even = new Member(test_data_even);
test('Calendarのテスト', () => {
  expect(testMember_odd).toEqual({"array_member": ["Taro", "Jiro", "Saburo", "Shiro", "Goro"]});
  expect(testMember_odd.getShuffleMember()).toContain("Taro","Jiro","Saburo", "Shiro", "Goro");
  expect(testMember_odd.createPair().length).toEqual(3);

  expect(testMember_even).toEqual({"array_member": ["Taro", "Jiro", "Saburo", "Shiro", "Goro",'Rokuro']});
  expect(testMember_even.getShuffleMember()).toContain("Taro","Jiro","Saburo", "Shiro", "Goro",'Rokuro');
  expect(testMember_even.createPair().length).toEqual(3);
  
});
