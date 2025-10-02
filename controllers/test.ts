import { Request, Response } from 'express';

export async function test(req: Request, res: Response) {
  res.send('Hello World! Welcome to the RFID Spotify Player API');
}
