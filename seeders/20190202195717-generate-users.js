'use strict';

const faker = require('faker');


module.exports = {
  up: (queryInterface, Sequelize) => {

    let users = [];

    for (let i = 0; i < 100; i++) {
      users.push({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      });
    }

    return queryInterface.bulkInsert('users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
