
const redis = require('redis');
const util = require('util');

exports.ROLE_ADMIN = 'admin';
exports.ROLE_USER = 'user';
exports.ROLE_DEVELOPER = 'developer';

exports.CHANGE_TMP_PASSWORD = 'CHANGE_TMP_PASSWORD';

exports.getMessage = function(isError, message, id = '', password = '') {
  if (isError) {
    return {error: message};
  } else {
    return {success: message, id: id, password: password};
  }
};

/**
 * @param  {string[]} roles The roles delimited by | against which the validation needs to be done
 * @param  {String} reqRole The role to be validated
 * @param  {Response} res 401 is reqRole is not present n roles
 * @description Validation of the role
 * @example roles - 'user|developer' reqRole - 'admin' returns 401
 */
exports.validateRole = async function(roles, reqRole, res) {
  if (!reqRole || !roles || reqRole.length === 0 || roles.length === 0 || !roles.includes(reqRole)) {
    // user's role is not authorized
    return res.sendStatus(401).json({message: 'Unauthorized Role'});
  }
};

exports.capitalize = function(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * @param  {int} storeId
 * @description Creates a redis client based on the storeID and allows promisify methods using util
 */
exports.createRedisClient = async function(storeId) {
  // TODO: Handle using config file
  let redisPassword;
  if (storeId === 1) {
    redisUrl = 'redis://127.0.0.1:6379';
    redisPassword = 'store1nusayer';
  } else if (storeId === 2) {
    redisUrl = 'redis://127.0.0.1:6380';
    redisPassword = 'store2nusayer';
  } else if (storeId === 3) {
    redisUrl = 'redis://127.0.0.1:6381';
    redisPassword = 'store3nusayer';
  }
  const redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  // NOTE: Node Redis currently doesn't natively support promises
  // Util node package to promisify the get function of the client redis
  redisClient.get = util.promisify(redisClient.get);
  return redisClient;
};
