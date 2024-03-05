const Sequelize = require('sequelize');

  class Post extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static initiate(sequelize) {
      Post.init({
        memberId : {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Members',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sex: {
          type: Sequelize.ENUM('M', 'F'), // 'mail'을 'male'로 수정
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        img_link: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      }, {
        sequelize,
        modelName: 'Post',
        tableName : 'Posts',
        paranoid: true, // true로 설정 시 데이터 삭제 시 완벽하게 삭제하지 않고 삭제기록
        charset: 'utf8',
        collate: 'utf8_general_ci',
      });
    }

    static associate(db) {
      db.Post.belongsTo(db.Member);
    }
}
module.exports = Post;

/*
const Sequelize = require('sequelize');


class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init({
      title: DataTypes.STRING,
      sex: DataTypes.ENUM('mail', 'femail'),
      city: DataTypes.STRING,
      content: DataTypes.TEXT,
      img_link: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'Post',
    });
  }

  static associate(db) {
    // define association here
    db.Post.belonsTo(Member);
  }
}

module.exports = Post;
*/