'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    let messages = [];

    for (let i = 0; i < 100; i++) {
      messages.push({
        text: faker.lorem.sentence(),
        threadId: Math.floor(Math.random() * 98) + 1,
        userId: Math.floor(Math.random() * 98) + 1,
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      });
    }

    return queryInterface.bulkInsert('messages', messages, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('messages', null, {});
  }
};
