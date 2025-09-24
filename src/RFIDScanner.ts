export class RFIDScanner {
  private RFIDTags: string[] = ['111', '222', '333', '444'];

  connectionStatus: boolean;

  constructor() {
    this.connectionStatus = false;
  }

  public async initialize(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate hardware initialization completed
        this.connectionStatus = true;
        resolve();
      }, 500); // 500ms delay to simulate hardware initialization
    });
  }

  public isConnected(): boolean {
    return this.connectionStatus;
  }

  public scan(): number {
    if (!this.connectionStatus) {
      throw new Error('RFIDScanner not initialized');
    }
    const randomTag: number = Math.floor(Math.random() * this.RFIDTags.length);
    const RFIDTag: number = parseInt(this.RFIDTags[randomTag]);

    return RFIDTag;
  }
}
