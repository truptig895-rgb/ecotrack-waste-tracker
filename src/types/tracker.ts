export interface TrackerInputs {
  userName: string;
  plasticItems: string;
  paperItems: string;
  reusableItems: string;
}

export interface TrackerValidationErrors {
  userName?: string;
  plasticItems?: string;
  paperItems?: string;
  reusableItems?: string;
  general?: string;
}

export type ImpactStatusLevel = 'champion' | 'conscious' | 'moderate' | 'high_waste';

export interface ImpactResultsData {
  userName: string;
  totalItems: number;
  plasticCount: number;
  paperCount: number;
  reusableCount: number;
  plasticPercentage: number;
  paperPercentage: number;
  reusableRatio: number;
  sustainabilityScore: number;
  statusLevel: ImpactStatusLevel;
  statusTitle: string;
  statusMessage: string;
  estimatedCarbonGrams: number;
  estimatedLandfillGrams: number;
  itemsDiverted: number;
  calculatedAt: string;
}

export interface HistoryRecord extends ImpactResultsData {
  id: string;
}
