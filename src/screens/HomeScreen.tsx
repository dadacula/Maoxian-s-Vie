import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../services/storage';
import { JournalEntry } from '../types';
import { getMoodEmoji, formatDate } from '../utils/imageHelper';
import { DEMO_ENTRIES } from '../utils/demoData';

const { width } = Dimensions.get('window');

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

  const renderEntry = ({ item, index }: { item: JournalEntry; index: number }) => {
    if (index === 0) {
      // Featured entry card
      return (
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => navigation.navigate('JournalDetail', { entryId: item.id })}
        >
          <View style={styles.featuredImageContainer}>
            <Image source={{ uri: item.photoUri }} style={styles.featuredImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.featuredGradient}
            />
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>
                {new Date(item.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredTitle}>The Autumn Waltz</Text>
              <Text style={styles.featuredSubtitle}>A SENSORY EXPLORATION</Text>
            </View>
            <Text style={styles.featuredExcerpt} numberOfLines={3}>
              {item.content}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
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
  };

  return (
    <View style={styles.container}>
      {/* Texture overlay */}
      <View style={styles.textureOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/48' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileLabel}>DISTINGUISHED GUEST</Text>
            <Text style={styles.profileName}>Xiǎo Máoxiàn</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyText}>还没有日记呢！</Text>
          <Text style={styles.emptySubtext}>拍张照片，让小毛线写下今天的故事吧</Text>
          <TouchableOpacity style={styles.demoButton} onPress={loadDemoData}>
            <Text style={styles.demoButtonText}>📚 加载示例日记</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.titleSection}>
            <View style={styles.titleDivider} />
            <Text style={styles.dayCounter}>Day {entries.length} of elegance</Text>
          </View>

          <Text style={styles.mainTitle}>
            Chronicle the{'\n'}
            <Text style={styles.mainTitleItalic}>extraordinary</Text>
          </Text>

          <Text style={styles.description}>
            Preserving the refined moments of your companion's journey through AI artistry.
          </Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Journal Entry</Text>
            <TouchableOpacity>
              <Text style={styles.archivesLink}>ARCHIVES</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={renderEntry}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}

      {/* Bottom navigation */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={['transparent', '#F9F5F0', '#F9F5F0']}
          style={styles.bottomGradient}
        />

        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <LinearGradient
            colors={['#AA8928', '#D4AF37', '#F1D38E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.captureButtonGradient}
          >
            <Text style={styles.captureIcon}>📷</Text>
            <Text style={styles.captureText}>CAPTURE MOMENT</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={[styles.navIcon, styles.navIconActive]}>📖</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🖼️</Text>
            <Text style={styles.navLabel}>GALLERY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>📜</Text>
            <Text style={styles.navLabel}>CHRONICLE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F5F0',
  },
  textureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: '#E5E5E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  profileLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#666',
    fontWeight: '500',
  },
  profileName: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#1C1C1C',
    fontWeight: '400',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    color: '#666',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  titleDivider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
  },
  dayCounter: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 42,
    color: '#121212',
    paddingHorizontal: 20,
    marginTop: 16,
    fontWeight: '400',
    lineHeight: 50,
  },
  mainTitleItalic: {
    fontStyle: 'italic',
    color: '#AA8928',
    fontWeight: '400',
  },
  description: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 280,
    fontWeight: '300',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#1C1C1C',
    fontWeight: '400',
  },
  archivesLink: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#AA8928',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 200,
  },
  featuredCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    padding: 12,
    marginBottom: 16,
  },
  featuredImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4 / 5,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuredBadgeText: {
    fontSize: 9,
    letterSpacing: 3,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  featuredContent: {
    paddingTop: 24,
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  featuredHeader: {
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#1C1C1C',
    lineHeight: 30,
    fontWeight: '400',
  },
  featuredSubtitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  featuredExcerpt: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
    fontStyle: 'italic',
    fontWeight: '300',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(212, 175, 55, 0.3)',
    paddingLeft: 16,
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
    color: '#1C1C1C',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  demoButton: {
    marginTop: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AA8928',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    pointerEvents: 'none',
  },
  captureButton: {
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 10,
  },
  captureButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  captureIcon: {
    fontSize: 18,
  },
  captureText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#F9F5F0',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.4,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: '700',
    color: '#666',
    opacity: 0.4,
  },
  navLabelActive: {
    color: '#D4AF37',
    opacity: 1,
  },
});
