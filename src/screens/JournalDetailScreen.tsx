import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StorageService } from '../services/storage';
import { JournalEntry } from '../types';
import { getMoodEmoji, formatDate } from '../utils/imageHelper';

export default function JournalDetailScreen({ route, navigation }: any) {
  const { entryId } = route.params;
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    const journalEntry = await StorageService.getJournalEntry(entryId);
    setEntry(journalEntry);
  };

  const handleDelete = () => {
    Alert.alert(
      '删除日记',
      '确定要删除这篇日记吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteJournalEntry(entryId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>日记未找到</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: entry.photoUri }} style={styles.photo} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{formatDate(entry.timestamp)}</Text>
            <Text style={styles.fullDate}>
              {new Date(entry.timestamp).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </Text>
          </View>
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
            <Text style={styles.moodText}>{entry.mood}</Text>
          </View>
        </View>

        <View style={styles.journalContainer}>
          <Text style={styles.journalTitle}>🐕 小毛线的心声</Text>
          <Text style={styles.journalText}>{entry.content}</Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>删除日记</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  photo: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  fullDate: {
    fontSize: 14,
    color: '#A0522D',
    marginTop: 4,
  },
  moodContainer: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodText: {
    fontSize: 12,
    color: '#A0522D',
    marginTop: 4,
  },
  journalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  journalText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333',
  },
  deleteButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FF4444',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 100,
  },
});
