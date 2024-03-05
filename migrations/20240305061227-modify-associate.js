'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Posts', 'memberId', {
      type : Sequelize.INTEGER,
      allowNull : false,
      references : {
        model : 'Members',
        key : 'id' 
      },
      onUpdate: 'CASCADE', // 데이터의 무결성을 지켜주기 위해 작성
      onDelete: 'CASCADE', // 데이터의 무결성을 지켜주기 위해 작성
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Boards', 'userId');
  }
};
