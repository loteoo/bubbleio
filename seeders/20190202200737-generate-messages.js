'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Message', [{
      text: faker.lorem.sentence(),
      threadId: faker.helpers.replaceSymbolWithNumber("##"),
      userId: faker.helpers.replaceSymbolWithNumber("##")
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Message', null, {});
  }
};
