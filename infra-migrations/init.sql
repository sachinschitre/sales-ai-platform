-- Initialize Sales AI Platform Database
-- This file is executed when the PostgreSQL container starts

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional schemas if needed
CREATE SCHEMA IF NOT EXISTS sales_ai;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA sales_ai TO sales_ai_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA sales_ai TO sales_ai_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA sales_ai TO sales_ai_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA sales_ai GRANT ALL ON TABLES TO sales_ai_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA sales_ai GRANT ALL ON SEQUENCES IN SCHEMA sales_ai TO sales_ai_user;
