import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StorageService } from '../services/storage';
import { JournalEntry } from '../types';
import { getMoodEmoji, formatDate } from '../utils/imageHelper';
import { getMoodDisplayName } from '../utils/moodThemes';

const { width } = Dimensions.get('window');

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
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
        <Text style={styles.errorText}>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: entry.photoUri }} style={styles.photo} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.imageGradient}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageDate}>
              {new Date(entry.timestamp).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.imageTitle}>The Golden Afternoon</Text>
          </View>
        </View>

        {/* Content section */}
        <View style={styles.content}>
          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.moodBadge}>
              <View style={styles.moodPulse} />
              <Text style={styles.moodLabel}>{getMoodDisplayName(entry.mood as any).toUpperCase()}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>HAMPSTEAD HEATH</Text>
            </View>
          </View>

          {/* English content */}
          <View style={styles.section}>
            <Text style={styles.contentText}>
              {entry.content}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
          </View>

          {/* Chinese content (mock - in real app would be translated) */}
          <View style={styles.section}>
            <Text style={styles.contentTextChinese}>
              今日是一场纯粹喜悦的交响乐。人类将那颗金色的球抛向清冷的空气中，那一刻，我仿佛失去了重力。
            </Text>
          </View>

          {/* Footer branding */}
          <View style={styles.footer}>
            <Text style={styles.footerIcon}>🐾</Text>
            <Text style={styles.footerText}>LUXE CANINE MEMOIRS</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>♡</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryAction}>
            <LinearGradient
              colors={['#D4AF37', '#C5A059']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryActionGradient}
            >
              <Text style={styles.primaryActionIcon}>✨</Text>
              <Text style={styles.primaryActionText}>REFINE STORY</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Text style={styles.actionIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F2',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 32,
    left: 32,
  },
  imageDate: {
    fontSize: 10,
    letterSpacing: 3,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '500',
  },
  imageTitle: {
    fontSize: 24,
    fontStyle: 'italic',
    color: 'white',
    fontWeight: '400',
  },
  content: {
    padding: 32,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(242, 232, 207, 1)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    gap: 12,
  },
  moodPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
  },
  moodLabel: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#D4AF37',
    fontWeight: '700',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginBottom: 40,
  },
  contentText: {
    fontSize: 20,
    lineHeight: 36,
    color: '#1C1C1C',
    fontStyle: 'italic',
    fontWeight: '300',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  contentTextChinese: {
    fontSize: 18,
    lineHeight: 32,
    color: '#666',
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    marginTop: 80,
    opacity: 0.4,
  },
  footerIcon: {
    fontSize: 32,
    color: '#C5A059',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 9,
    letterSpacing: 4,
    color: '#C5A059',
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: 50,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 50,
    pointerEvents: 'auto',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    color: '#666',
  },
  primaryAction: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: 'rgba(212, 175, 55, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryActionIcon: {
    fontSize: 16,
  },
  primaryActionText: {
    fontSize: 12,
    letterSpacing: 3,
    color: 'white',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 100,
  },
});
