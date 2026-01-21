import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../services/storage';
import { JournalEntry } from '../types';
import { getMoodEmoji, formatDate } from '../utils/imageHelper';
import { DEMO_ENTRIES } from '../utils/demoData';
import { getMoodTheme } from '../utils/moodThemes';

export default function HomeScreen({ navigation }: any) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDemoData = async () => {
    for (const entry of DEMO_ENTRIES) {
      await StorageService.saveJournalEntry(entry);
    }
    await loadEntries();
  };

  const loadEntries = async () => {
    const allEntries = await StorageService.getAllJournalEntries();
    setEntries(allEntries);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => navigation.navigate('JournalDetail', { entryId: item.id })}
    >
      <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
      <View style={styles.entryContent}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
        </View>
        <Text style={styles.entryPreview} numberOfLines={3}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Get theme based on most recent entry's mood
  const currentMood = entries.length > 0 ? entries[0].mood : 'happy';
  const theme = getMoodTheme(currentMood as any);

  return (
    <LinearGradient
      colors={theme.gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>🐕 小毛线的日记</Text>
        <Text style={[styles.subtitle, { color: theme.textColor }]}>Little Yarn's Journal</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={[styles.emptyText, { color: theme.textColor }]}>还没有日记呢！</Text>
          <Text style={[styles.emptySubtext, { color: theme.textColor }]}>拍张照片，让小毛线写下今天的故事吧</Text>
          <TouchableOpacity style={[styles.demoButton, { backgroundColor: theme.cardBackground }]} onPress={loadDemoData}>
            <Text style={[styles.demoButtonText, { color: theme.textColor }]}>📚 加载示例日记</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  subtitle: {
    fontSize: 14,
    color: '#A0522D',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  entryContent: {
    flex: 1,
    padding: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  moodEmoji: {
    fontSize: 20,
  },
  entryPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '300',
  },
  demoButton: {
    marginTop: 20,
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
});
