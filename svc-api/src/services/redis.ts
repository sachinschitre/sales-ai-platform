import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import { logger } from '../utils/logger';

class RedisService {
  private client: RedisClientType | null = null;

  async connect(): Promise<void> {
    try {
      logger.info('Connecting to Redis...');
      
      this.client = createClient({
        url: config.redisUrl
      });
      
      this.client.on('error', (error) => {
        logger.error('Redis client error:', error);
      });
      
      this.client.on('connect', () => {
        logger.info('Connected to Redis successfully');
      });
      
      this.client.on('ready', () => {
        logger.info('Redis client ready');
      });
      
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
        this.client = null;
      }
      
      logger.info('Disconnected from Redis');
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.client) {
        throw new Error('Redis not connected');
      }
      
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Failed to get key ${key} from Redis:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Redis not connected');
      }
      
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error(`Failed to set key ${key} in Redis:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Redis not connected');
      }
      
      await this.client.del(key);
    } catch (error) {
      logger.error(`Failed to delete key ${key} from Redis:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.client) {
        throw new Error('Redis not connected');
      }
      
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Failed to check existence of key ${key} in Redis:`, error);
      return false;
    }
  }
}

export const redisService = new RedisService();
