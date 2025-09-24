import { RFIDScanner } from '../../src/RFIDScanner';

describe('RFID Scanner Interface', () => {
  describe('isConnected()', () => {
    //
    test('RFIDScanner not initialized', () => {
      const rfidScanner = new RFIDScanner();
      expect(rfidScanner.isConnected()).toBe(false);
    });
    test('returns true after Initialization', async () => {
      const rfidScanner = new RFIDScanner();
      await rfidScanner.initialize();
      expect(rfidScanner.isConnected()).toBe(true);
    });
  });
  describe('initialize()', () => {
    // Testing the initialization process
    test('Initializes set up', async () => {
      const rfidScanner = new RFIDScanner();
      expect(rfidScanner.isConnected()).toBe(false);
      // Call startup and await its completion
      await rfidScanner.initialize();
      expect(rfidScanner.isConnected()).toBe(true);
    });
  });
  describe('scan()', () => {
    test('throws error if scan called before Initialization', () => {
      const rfidScanner = new RFIDScanner();
      expect(() => rfidScanner.scan()).toThrow('RFIDScanner not initialized');
    });
    test('passes when scanner is initialized and returns a tag ID ', async () => {
      const rfidScanner = new RFIDScanner();
      await rfidScanner.initialize();

      const id = rfidScanner.scan();

      expect(typeof id).toBe('number');
    });
  });
});
