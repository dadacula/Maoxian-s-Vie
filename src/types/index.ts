export interface JournalEntry {
  id: string;
  date: string;
  photoUri: string;
  content: string;
  mood: 'happy' | 'excited' | 'playful' | 'tired' | 'curious' | 'mischievous';
  timestamp: number;
}

export interface GeminiResponse {
  mood: string;
  activities: string[];
  feelings: string;
  journal: string;
}
