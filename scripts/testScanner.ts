import { RFIDScanner } from '../src/RFIDScanner.js';
const testScanner = async () => {
  try {
    const scanner = new RFIDScanner();
    await scanner.initialize();

    for (let i = 1; i <= 10; i++) {
      const tagID = scanner.scan();
      console.log(`RFID Tag Scanned: ${tagID}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('An error occurred:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
};

testScanner();
