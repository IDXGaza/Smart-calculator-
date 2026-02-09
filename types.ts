
export enum AppTab {
  CALCULATOR = 'CALCULATOR',
  CONVERTER = 'CONVERTER'
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface ConversionResult {
  from: string;
  to: string;
  rate: number;
  amount: number;
  result: number;
  lastUpdate: string;
  sources?: string[];
}
