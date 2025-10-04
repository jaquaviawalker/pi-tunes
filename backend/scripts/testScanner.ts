import { Mfrc522Scanner } from '../src/Mfrc522Scanner';

async function testScanner() {
  console.log('=== RFID Scanner Test ===\n');

  const scanner = new Mfrc522Scanner();

  console.log('Place a card on the reader...');
  const result = scanner.readCard();

  if (result.success) {
    console.log('✅ Card detected!');
    console.log(`UID: ${result.uid}`);
    console.log(`Message: ${result.message}`);
  } else {
    console.log('❌ Scan failed');
    console.log(`Message: ${result.message}`);
  }

  // Clean up
  scanner.dispose();
}

// Run the test
testScanner().catch(console.error);
