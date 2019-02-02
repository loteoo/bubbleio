'use strict';

const faker = require('faker');


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [{
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
