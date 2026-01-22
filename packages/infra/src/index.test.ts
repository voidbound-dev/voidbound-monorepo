import { INFRA } from './index';

describe('Infra Package', () => {
  it('должен экспортировать константу INFRA', () => {
    expect(INFRA).toBe(true);
  });
});
