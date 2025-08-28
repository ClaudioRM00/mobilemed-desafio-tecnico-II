import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should be defined', () => {
    expect(appConfig).toBeDefined();
  });

  it('should have providers array', () => {
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
  });

  it('should have correct number of providers', () => {
    // 5 providers: browserGlobalErrorListeners, zoneChangeDetection, router, animations, httpClient
    expect(appConfig.providers.length).toBe(5);
  });
});
