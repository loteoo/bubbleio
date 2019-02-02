'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {

    let bubbles = [];

    for (let i = 0; i < 10; i++) {
      
     const word = faker.random.word();

      bubbles.push({
        name: faker.helpers.slugify(word).toLowerCase(),
        title: word,
        description: faker.lorem.sentences(),
        public: faker.random.boolean(),
        default: faker.random.boolean(),
        userId: Math.floor(Math.random() * 98) + 1,
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      });

    }
    return queryInterface.bulkInsert('bubbles', bubbles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bubbles', null, {});
  }
};
