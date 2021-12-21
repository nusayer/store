/* eslint-disable new-cap */
const fs = require('fs');
const {enrollAdminStore1} = require('./enrollAdmin-Store1');
const {enrollAdminStore2} = require('./enrollAdmin-Store2');
const {enrollRegisterUser} = require('./registerUser');
const {createRedisClient} = require('./utils');

const redis = require('redis');

/**
 * @description Init the redis db with the admins credentials
 */
async function initRedis() {
  let redisUrl = 'redis://127.0.0.1:6379';
  let redisPassword = 'store1nusayer';
  let redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET('store1admin', redisPassword);
  redisClient.QUIT();

  redisUrl = 'redis://127.0.0.1:6380';
  redisPassword = 'store2nusayer';
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET('store2admin', redisPassword);
  console.log('Done');
  redisClient.QUIT();
  return;
}

/**
 * @description Create users in both organizations based on the initUser JSON
 */
async function enrollAndRegisterUsers() {
  try {
    const jsonString = fs.readFileSync('./initUsers.json');
    const users = JSON.parse(jsonString);
    for (let i = 0; i < users.length; i++) {
      const attr = {name: users[i].name, email: users[i].email, role: 'user'};
      // Create a redis client and add the user to redis
      users[i].storeId = parseInt(users[i].storeId);
      const redisClient = createRedisClient(users[i].storeId);
      (await redisClient).SET('USER' + i, 'password');
      await enrollRegisterUser(users[i].storeId, 'USER' + i, JSON.stringify(attr));
      (await redisClient).QUIT();
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description Create developers in both organizations based on the initDeveloper JSON
 */
async function enrollAndRegisterDevelopers() {
  try {
    const jsonString = fs.readFileSync('./initDevelopers.json');
    const developers = JSON.parse(jsonString);
    for (let i = 0; i < developers.length; i++) {
      const attr = {name: developers[i].name, email: developers[i].email, role: 'developer'};
      // Create a redis client and add the user to redis
      developers[i].storeId = parseInt(developers[i].storeId);
      const redisClient = createRedisClient(developers[i].storeId);
      (await redisClient).SET('DEVELOPERS' + i, 'password');
      await enrollRegisterUser(developers[i].storeId, 'DEVELOPERS' + i, JSON.stringify(attr));
      (await redisClient).QUIT();
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description Function to initialise the backend server, enrolls and regsiter the admins and initLedger users and developers.
 */
async function main() {
  await enrollAdminStore1();
  await enrollAdminStore2();
  await initLedger();
  await initRedis();
  await enrollAndRegisterUsers();
  await enrollAndRegisterDevelopers();
}


main();
