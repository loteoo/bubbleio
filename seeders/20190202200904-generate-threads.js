'use strict';


const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const types = faker.helpers.shuffle(["text", "image", "link"]);
    return queryInterface.bulkInsert('Thread', [{
      title: faker.random.word(),
      type: types[0],
      link: faker.internet.url(),
      image: faker.image.imageUrl(),
      text: faker.lorem.sentences(),
      bubbleId: faker.helpers.replaceSymbolWithNumber("##"),
      userId: faker.helpers.replaceSymbolWithNumber("##")
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Thread', null, {});
  }
};
