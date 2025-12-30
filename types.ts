
export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
}

export interface WinterAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  action: string;
  timestamp: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  category: 'Essentials' | 'Vehicle' | 'Home' | 'Health';
  completed: boolean;
}

export interface HealthTip {
  title: string;
  content: string;
  category: 'Flu' | 'Hypothermia' | 'Activity' | 'Hydration';
}

export interface DashboardSummary {
  currentTemp: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  summary: string;
  groundingSources: { uri: string; title: string }[];
}
