'use strict';


const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    let threads = [];

    for (let i = 0; i < 200; i++) {
      const types = faker.helpers.shuffle(["text", "image", "link"]);
      threads.push({
        title: faker.random.word(),
        type: types[0],
        link: faker.internet.url(),
        image: faker.image.imageUrl(),
        text: faker.lorem.sentences(),
        bubbleId: Math.floor(Math.random() * 18) + 1,
        userId: Math.floor(Math.random() * 98) + 1,
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      });
    }

    return queryInterface.bulkInsert('threads', threads, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('threads', null, {});
  }
};
