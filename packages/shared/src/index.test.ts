import { VERSION } from './index';

describe('Shared Package', () => {
  it('должен иметь определенную версию', () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe('string');
  });
});
