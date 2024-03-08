const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {

static initiate(sequelize) {
    Hashtag.init({
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
  }, {
    sequelize, // static init의 매개변수와 연결되는 옵션, model/index.js에서 연결
    modelName: 'Hashtag', // 프로젝트에서 사용하는 모델의 이름
    tableName: 'hashtags', // 실제 데이터베이스의 테이블 이름
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, {through : 'PostHashtag'});
  }
};

module.exports = Hashtag;