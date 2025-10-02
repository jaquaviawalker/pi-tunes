"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJson = require('../../package.json');
test('project name is pi-tunes', () => {
    expect(packageJson.name).toBe('pi-tunes');
});
