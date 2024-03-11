const Sequelize = require('sequelize');

class Member extends Sequelize.Model {

  /*
    static init:
    테이블에 대한 자료형 지정 및 테이블 자체 설정

    static associate:
    테이블과 테이블의 관계에 대한 설정
  */

static initiate(sequelize) {
  Member.init({
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  }, {
    sequelize, // static init의 매개변수와 연결되는 옵션, model/index.js에서 연결
    modelName: 'Member', // 프로젝트에서 사용하는 모델의 이름
    tableName: 'members', // 실제 데이터베이스의 테이블 이름
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}

  static associate(db) {
    db.Member.hasMany(db.Post);
  }
};

module.exports = Member;