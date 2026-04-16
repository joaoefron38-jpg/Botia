export interface BettingHouse {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface AviatorResult {
  id: string;
  multiplier: number;
  timestamp: Date;
}

export type SequenceType = '2x+' | 'none';
