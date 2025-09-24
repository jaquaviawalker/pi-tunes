import { Configuration } from './RfidConfiguration';

export class RFIDScanner {
  private RFIDTags: string[];
  private successRate: number;
  private initDelay: number;
  private connectionStatus: boolean;

  constructor(config?: Configuration) {
    this.RFIDTags = ['111', '222', '333', '444'];
    this.successRate = 100;
    this.initDelay = 500;
    this.connectionStatus = false;

    if (config) {
      if (config.customTagSets) this.RFIDTags = config.customTagSets;
      if (config.successRate !== undefined)
        this.successRate = config.successRate;
      if (config.initDelay !== undefined) this.initDelay = config.initDelay;
    }
  }

  public async initialize(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate hardware initialization completed
        this.connectionStatus = true;
        resolve();
      }, this.initDelay); // 500ms delay to simulate hardware initialization
    });
  }

  public isConnected(): boolean {
    return this.connectionStatus;
  }

  public scan(): number | null {
    if (!this.connectionStatus) {
      throw new Error('RFIDScanner not initialized');
    }
    if (Math.floor(Math.random() * 101) > this.successRate) {
      return null;
    }
    return parseInt(
      this.RFIDTags[Math.floor(Math.random() * this.RFIDTags.length)]
    );
  }
}
