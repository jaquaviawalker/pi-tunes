const path = require('path');
const filePath = require('../../package.json');

test('project name is pi-tunes', () => {
  expect(filePath.name).toBe('pi-tunes');
});
