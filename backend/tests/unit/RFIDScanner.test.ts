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
      await rfidScanner.init();
      expect(rfidScanner.isConnected()).toBe(true);
    });
  });
  describe('initialize()', () => {
    // Testing the initialization process
    test('Initializes set up', async () => {
      const rfidScanner = new RFIDScanner();
      expect(rfidScanner.isConnected()).toBe(false);
      // Call startup and await its completion
      await rfidScanner.init();
      expect(rfidScanner.isConnected()).toBe(true);
    });
  });
  describe('scan()', () => {
    test('throws error if scan called before Initialization', async () => {
      const rfidScanner = new RFIDScanner();
      await expect(rfidScanner.scan()).rejects.toThrow(
        'RFIDScanner not initialized'
      );
    });
    test('passes when scanner is initialized and returns a tag ID ', async () => {
      const rfidScanner = new RFIDScanner();
      await rfidScanner.init();

      const id = await rfidScanner.scan();

      expect(typeof id).toBe('string');
    });
  });
});
