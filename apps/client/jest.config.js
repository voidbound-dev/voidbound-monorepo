const rootConfig = require('../../jest.config.js');
const path = require('path');

module.exports = {
  ...rootConfig,
  rootDir: '.',
  moduleNameMapper: {
    '^@voidbound/(.*)$': path.resolve(__dirname, '../../packages/$1/src'),
  },
};
