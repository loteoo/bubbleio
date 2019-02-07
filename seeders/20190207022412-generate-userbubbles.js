'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    let userbubbles = [];

    for (let i = 0; i < 1000; i++) {
      userbubbles.push({
        userId: Math.floor(Math.random() * 98) + 1,
        bubbleId: Math.floor(Math.random() * 18) + 1,
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      })
    }

    return queryInterface.bulkInsert('userbubbles', userbubbles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userbubbles', null, {});
  }
};
