'use strict';

const faker = require('faker');


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bump', [{
      size: faker.random.number(),
      threadId: faker.helpers.replaceSymbolWithNumber("##"),
      userId: faker.helpers.replaceSymbolWithNumber("##")
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bump', null, {});
  }
};
