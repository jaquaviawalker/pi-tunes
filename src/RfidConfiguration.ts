/**
 * Configuration options for the RFID Scanner
 */
export interface Configuration {
  /** Custom set of RFID tag IDs to use (as strings) */
  customTagSets?: string[];

  /** Success rate for scanning (0-100 percentage) */
  successRate?: number;

  /** Delay in milliseconds for initialization */
  initDelay?: number;
}
