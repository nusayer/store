
/* eslint-disable new-cap */
const {enrollAdminStore3} = require('./enrollAdmin-Store3');
const redis = require('redis');

/**
 * @description enrol admin of Store 3 in redis
 */
async function initRedis3() {
  redisUrl = 'redis://127.0.0.1:6381';
  redisPassword = 'store3nusayer';
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET('store3admin', redisPassword);
  console.log('Done');
  redisClient.QUIT();
  return;
}

/**
 * @description enrol admin of Store 3
 */
async function main() {
  await enrollAdminStore3();
  await initRedis3();
}

main();
