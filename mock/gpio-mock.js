// mock/gpio-mock.js
module.exports = {
  readRFID: () => {
    // Simulated tag IDs
    const tags = ['123ABC', '456DEF', '789XYZ'];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    console.log(`(Mock) Scanned tag: ${tag}`);
    return tag;
  },

  displayLCD: (text) => {
    console.log(`(Mock LCD) ${text}`);
  },
};
