/**
 * @author Nusayer 
 * @desc Client library to connect redis key-value pair database
 */

const redis = require('redis');

module.exports = function(option) {
  const client = redis.createClient({
    host: option.host,
    port: option.port,
  });

  client.on('connect', () => {
    console.log('Client connected to redis...');
  });

  client.on('ready', () => {
    console.log('Client connected to redis and ready to use...');
  });

  client.on('error', (err) => {
    console.error(err.message);
  });

  client.on('end', () => {
    console.log('Client disconnected from redis.');
  });

  process.on('SIGINT', () => {
    client.quit();
  });

  return client;
};
