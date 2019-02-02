'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const word = faker.random.word();
    return queryInterface.bulkInsert('Bubble', [{
      name: faker.helpers.slugify(word),
      title: word,
      description: faker.random.words(),
      public: faker.random.boolean(),
      default: faker.random.boolean(),
      userId: faker.helpers.replaceSymbolWithNumber("##")
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bubble', null, {});
  }
};
