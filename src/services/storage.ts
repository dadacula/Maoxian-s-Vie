import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../types';

const JOURNAL_ENTRIES_KEY = '@xiaomiaoxian_journal_entries';

export class StorageService {
  static async saveJournalEntry(entry: JournalEntry): Promise<void> {
    try {
      const existingEntries = await this.getAllJournalEntries();
      const updatedEntries = [entry, ...existingEntries];
      await AsyncStorage.setItem(
        JOURNAL_ENTRIES_KEY,
        JSON.stringify(updatedEntries)
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  static async getAllJournalEntries(): Promise<JournalEntry[]> {
    try {
      const entriesJson = await AsyncStorage.getItem(JOURNAL_ENTRIES_KEY);
      if (!entriesJson) {
        return [];
      }
      return JSON.parse(entriesJson);
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  static async getJournalEntry(id: string): Promise<JournalEntry | null> {
    try {
      const entries = await this.getAllJournalEntries();
      return entries.find(entry => entry.id === id) || null;
    } catch (error) {
      console.error('Error getting journal entry:', error);
      return null;
    }
  }

  static async deleteJournalEntry(id: string): Promise<void> {
    try {
      const entries = await this.getAllJournalEntries();
      const filteredEntries = entries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(
        JOURNAL_ENTRIES_KEY,
        JSON.stringify(filteredEntries)
      );
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }

  static async clearAllEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(JOURNAL_ENTRIES_KEY);
    } catch (error) {
      console.error('Error clearing journal entries:', error);
      throw error;
    }
  }
}
