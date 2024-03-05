'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'sex', {
      type : Sequelize.ENUM('M', 'F'),
      allowNull : false,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'sex', {
      type: Sequelize.ENUM('mail', 'femail'),
      allowNull: false,
    });
    // 롤백을 위한 다른 변경 사항들을 추가하십시오.
  }
};
