export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  version: '1.0.0',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3002', 'http://localhost:5173'],
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://sales_ai_user:sales_ai_password@localhost:5432/sales_ai_platform',
  
  // Message Queue
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://sales_ai_user:sales_ai_password@localhost:5672/sales_ai_vhost',
  
  // Cache
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Rate Limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // limit each IP to 100 requests per windowMs
};
