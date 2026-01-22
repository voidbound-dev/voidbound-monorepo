import { SERVER } from './index';

describe('Server App', () => {
  it('должен экспортировать константу SERVER', () => {
    expect(SERVER).toBe(true);
  });
});
