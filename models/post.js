const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
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
        title: Sequelize.STRING,
        problem_number: Sequelize.INTEGER,
        problem_link: Sequelize.STRING,
        rate: Sequelize.INTEGER,
        content: Sequelize.TEXT
      }, {
        sequelize,
        modelName: 'Post',
        tableName: 'Posts',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      });
  }
  static associate(db) {
    db.Post.belongsTo(db.Member);
    db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
  }
};
module.exports = Post;
