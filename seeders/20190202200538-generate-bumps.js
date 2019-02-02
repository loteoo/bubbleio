'use strict';

const faker = require('faker');


module.exports = {
  up: (queryInterface, Sequelize) => {
    
    let bumps = [];

    for (let i = 0; i < 100; i++) {
      bumps.push({
        size: faker.random.number(),
        threadId: Math.floor(Math.random() * 98) + 1,
        userId: Math.floor(Math.random() * 98) + 1,
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      });
    }

    return queryInterface.bulkInsert('bumps', bumps, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bumps', null, {});
  }
};
