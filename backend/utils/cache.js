import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient(process.env.REDIS_URL || 'redis://localhost:6379');

client.on('error', (err) => console.log('Redis Client Error', err));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = await getAsync(key);
    if (cachedResponse) {
      res.json(JSON.parse(cachedResponse));
      return;
    }
    res.originalJson = res.json;
    res.json = (body) => {
      setAsync(key, JSON.stringify(body), 'EX', duration);
      res.originalJson(body);
    };
    next();
  };
};

export const clearCache = async (key) => {
  await client.del(key);
};