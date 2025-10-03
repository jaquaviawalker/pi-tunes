import express from 'express';
import playbackRoutes from './routes/playbackRoutes';
import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/scanRoutes';
import testRoutes from './routes/testRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

// @ts-ignore
import Mfrc522 from 'mfrc522-rpi';
// @ts-ignore
import SoftSPI from 'rpi-softspi';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', playbackRoutes);
app.use('/api', scanRoutes);
app.use('/api', authRoutes);
app.use('/api', testRoutes);

/**
 * MFRC522 RFID Card Reader Test Application
 * This script demonstrates reading data from RFID cards using a MFRC522 module on Raspberry Pi.
 */

// Configure the connection to the RFID reader
const softSPI = new SoftSPI({
  clock: 23,  // SCK/SCLK pin
  mosi: 19,   // MOSI pin
  miso: 21,   // MISO pin
  client: 24  // CS/SDA pin
});

// Initialize the MFRC522 reader
// GPIO 24 can be used for SDA, GPIO 22 for RST, GPIO 18 for buzzer (optional)
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

console.log('Starting RFID Card Reader...');
console.log('Place an RFID card near the reader...');

// Function to convert array buffer to hexadecimal string
function bufferToHex(buffer: number[]): string {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Function to read card data
function readCard() {
  // Reset the device
  mfrc522.reset();
  
  // Check if a card is present
  let response = mfrc522.findCard();
  
  if (!response.status) {
    // No card found, retry after a delay
    setTimeout(readCard, 500);
    return;
  }
  
  console.log('Card detected!');
  
  // Get the UID (Unique Identifier) of the card
  const uidResponse = mfrc522.getUid();
  if (!uidResponse.status) {
    console.log('Error getting card UID. Trying again...');
    setTimeout(readCard, 1000);
    return;
  }
  
  // Display card information
  const uid = uidResponse.data;
  console.log('Card Information:');
  console.log('- UID:', bufferToHex(uid));
  console.log('- UID Length:', uid.length, 'bytes');
  
  // Select the card for further operations
  const memoryCapacity = mfrc522.selectCard(uid);
  console.log('Card Memory Capacity:', memoryCapacity);
  
  // Try to read data from the card's memory
  console.log('Attempting to read card data...');
  try {
    // The MFRC522 uses sector-based access
    // Most cards have default keys set to 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF
    const defaultKey = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
    
    // Try to authenticate with the card for sector 1
    // For MIFARE cards, sectors contain 4 blocks each
    // Sector 1 contains blocks 4-7, with block 4 being the first data block
    const blockNumber = 4; // First block of sector 1
    const sectorNumber = Math.floor(blockNumber / 4); // Calculate sector from block
    
    console.log('Trying to authenticate for sector:', sectorNumber, 'block:', blockNumber);
    const authStatus = mfrc522.authenticate(blockNumber, defaultKey, uid);
    
    if (authStatus) {
      console.log('Authentication successful for block', blockNumber);
      
      // Read data from the authenticated block
      const blockData = mfrc522.getDataForBlock(blockNumber);
      
      if (blockData && blockData.length > 0) {
        console.log('Data from block', blockNumber + ':', bufferToHex(blockData));
        
        // Display as ASCII if the data contains printable characters
        const asciiData = blockData.map(b => {
          return (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.';
        }).join('');
        console.log('Data as ASCII:', asciiData);
      } else {
        console.log('No data found in block', blockNumber);
      }
      
      // Stop crypto operations
      mfrc522.stopCrypto();
    } else {
      console.log('Authentication failed. Cannot read data from card.');
    }
  } catch (error: any) {
    console.error('Error reading card data:', error.message || 'Unknown error');
  }
  
  // Reset the device and continue scanning
  console.log('Waiting for next card...');
  setTimeout(readCard, 2000);
}

// Handle script termination gracefully
process.on('SIGINT', () => {
  console.log('Stopping RFID reader...');
  process.exit();
});

// Start the card reading loop
readCard();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
