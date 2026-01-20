import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GeminiService } from '../services/gemini';
import { StorageService } from '../services/storage';
import { convertImageToBase64 } from '../utils/imageHelper';
import { JournalEntry } from '../types';
import { GEMINI_API_KEY } from '@env';

export default function CameraScreen({ navigation }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedEntry, setGeneratedEntry] = useState<string | null>(null);
  const isDemoMode = !GEMINI_API_KEY || GEMINI_API_KEY === '';

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('错误', '无法打开相机');
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setSelectedImage(response.assets[0].uri);
          setGeneratedEntry(null);
        }
      }
    );
  };

  const handlePickPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('错误', '无法选择照片');
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setSelectedImage(response.assets[0].uri);
          setGeneratedEntry(null);
        }
      }
    );
  };

  const handleGenerateJournal = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const base64Image = await convertImageToBase64(selectedImage);
      const geminiService = new GeminiService();
      const result = await geminiService.analyzePhoto(base64Image);

      setGeneratedEntry(result.journal);

      // Save to storage
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        photoUri: selectedImage,
        content: result.journal,
        mood: result.mood as any,
        timestamp: Date.now(),
      };

      await StorageService.saveJournalEntry(entry);

      Alert.alert(
        '日记生成成功！',
        '小毛线的新日记已保存',
        [
          {
            text: '查看',
            onPress: () => navigation.navigate('JournalDetail', { entryId: entry.id }),
          },
          {
            text: '返回',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error generating journal:', error);
      Alert.alert(
        '生成失败',
        isDemoMode
          ? '演示模式出错。如需使用真实 AI 分析，请在 .env 文件中设置 Gemini API Key。'
          : '生成失败。请检查网络连接和 API Key 配置。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 新的一天</Text>
        <Text style={styles.subtitle}>拍张照片，让小毛线写日记</Text>
        {isDemoMode && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoText}>🎭 演示模式 (Demo Mode)</Text>
            <Text style={styles.demoSubtext}>使用模拟AI响应 · 不会真实分析照片</Text>
          </View>
        )}
      </View>

      {!selectedImage ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.buttonIcon}>📷</Text>
            <Text style={styles.buttonText}>拍照</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePickPhoto}>
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.buttonText}>从相册选择</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.preview} />

          {generatedEntry && (
            <View style={styles.journalPreview}>
              <Text style={styles.journalTitle}>小毛线说：</Text>
              <Text style={styles.journalText}>{generatedEntry}</Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setSelectedImage(null);
                setGeneratedEntry(null);
              }}
            >
              <Text style={styles.actionButtonText}>重新选择</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.generateButton]}
              onPress={handleGenerateJournal}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.actionButtonText}>
                  {generatedEntry ? '重新生成' : '生成日记'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  subtitle: {
    fontSize: 14,
    color: '#A0522D',
    marginTop: 4,
  },
  buttonContainer: {
    padding: 20,
    gap: 16,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
  },
  previewContainer: {
    padding: 20,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
  },
  journalPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  journalText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoBanner: {
    marginTop: 12,
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
  },
  demoSubtext: {
    fontSize: 11,
    color: '#856404',
    marginTop: 2,
  },
});
