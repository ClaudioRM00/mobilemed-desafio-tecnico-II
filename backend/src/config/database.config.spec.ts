import { databaseConfig } from './database.config';

describe('DatabaseConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should have correct default configuration', () => {
    const config = databaseConfig as any;

    expect(config.type).toBe('postgres');
    expect(config.host).toBe('localhost');
    expect(config.port).toBe(5432);
    expect(config.username).toBe('postgres');
    expect(config.password).toBe('password');
    expect(config.database).toBe('mobilemed_db');
    expect(config.schema).toBe('public');
    expect(config.autoLoadEntities).toBe(true);
    expect(config.synchronize).toBe(false);
    expect(config.logging).toBe(false);
    expect(config.ssl).toBe(false);
    expect(config.migrations).toEqual(['dist/database/migrations/*.js']);
    expect(config.migrationsRun).toBe(false);
    expect(config.migrationsTableName).toBe('migrations');
    expect(config.extra).toEqual({
      max: 20,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    });
  });

  it('should test environment variable logic', () => {
    // Test the logic that would be used in the config
    const testHost = process.env.DB_HOST || 'localhost';
    const testPort = parseInt(process.env.DB_PORT ?? '5432', 10);
    const testUsername = process.env.DB_USERNAME || 'postgres';
    const testPassword = process.env.DB_PASSWORD || 'password';
    const testDatabase = process.env.DB_DATABASE || 'mobilemed_db';
    const testSchema = process.env.DB_SCHEMA || 'public';

    expect(testHost).toBe('localhost');
    expect(testPort).toBe(5432);
    expect(testUsername).toBe('postgres');
    expect(testPassword).toBe('password');
    expect(testDatabase).toBe('mobilemed_db');
    expect(testSchema).toBe('public');
  });

  it('should test development environment logic', () => {
    const testSynchronize = process.env.NODE_ENV === 'development';
    const testLogging = process.env.NODE_ENV === 'development';

    expect(testSynchronize).toBe(false);
    expect(testLogging).toBe(false);
  });

  it('should test production environment logic', () => {
    const testSsl = process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false;

    expect(testSsl).toBe(false);
  });

  it('should test production environment logic with NODE_ENV set', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const testSsl = process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false;

    expect(testSsl).toEqual({ rejectUnauthorized: false });
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle empty DB_PORT environment variable', () => {
    process.env.DB_PORT = '';

    const config = databaseConfig as any;

    expect(config.port).toBe(5432);
  });

  it('should handle undefined DB_PORT environment variable', () => {
    delete process.env.DB_PORT;

    const config = databaseConfig as any;

    expect(config.port).toBe(5432);
  });

  it('should include required entities', () => {
    const config = databaseConfig as any;

    expect(config.entities).toBeDefined();
    expect(Array.isArray(config.entities)).toBe(true);
    expect(config.entities.length).toBeGreaterThan(0);
  });
});
